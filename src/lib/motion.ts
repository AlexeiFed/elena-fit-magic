import {
  createElement,
  forwardRef,
  Fragment,
  useEffect,
  useState,
  type ComponentPropsWithoutRef,
  type ElementType,
  type PropsWithChildren,
  type RefObject,
} from "react";

/**
 * Minimal motion-compatible surface used by the app.
 * We intentionally render regular DOM elements and strip motion-only props:
 * importing the full framer-motion barrel makes production builds hang here.
 */
const MOTION_ONLY_PROPS = new Set([
  "animate",
  "custom",
  "exit",
  "initial",
  "layout",
  "layoutId",
  "transition",
  "variants",
  "viewport",
  "whileHover",
  "whileInView",
  "whileTap",
]);

type MotionCompatibleProps<T extends ElementType> = ComponentPropsWithoutRef<T> & Record<string, unknown>;

function createMotionElement<T extends ElementType>(tag: T) {
  return forwardRef<HTMLElement, MotionCompatibleProps<T>>((props, ref) => {
    const domProps: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(props)) {
      if (!MOTION_ONLY_PROPS.has(key)) {
        domProps[key] = value;
      }
    }

    return createElement(tag, { ...domProps, ref });
  });
}

export const motion = {
  div: createMotionElement("div"),
  p: createMotionElement("p"),
  span: createMotionElement("span"),
};

type AnimatePresenceProps = PropsWithChildren<{
  mode?: "sync" | "popLayout" | "wait";
  initial?: boolean;
  onExitComplete?: () => void;
}>;

export function AnimatePresence({ children }: AnimatePresenceProps) {
  return createElement(Fragment, null, children);
}

type InViewOptions = {
  root?: RefObject<Element | null>;
  margin?: string;
  amount?: "some" | "all" | number;
  once?: boolean;
  initial?: boolean;
};

export function useInView(ref: RefObject<Element | null>, options: InViewOptions = {}) {
  const { root, margin, amount = "some", once = false, initial = false } = options;
  const [isInView, setIsInView] = useState(initial);

  useEffect(() => {
    const target = ref.current;
    if (!target || (once && isInView)) return;

    const threshold = amount === "all" ? 1 : amount === "some" ? 0 : amount;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
        if (entry.isIntersecting && once) observer.disconnect();
      },
      { root: root?.current ?? null, rootMargin: margin, threshold },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [amount, isInView, margin, once, ref, root]);

  return isInView;
}
