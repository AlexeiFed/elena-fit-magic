import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface RegistrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    serviceName?: string;
}

interface FormData {
    name: string;
    phone: string;
    message: string;
    whatsapp: boolean;
    telegram: boolean;
    telegramNickname: string;
    max: boolean;
    maxLink: string;
}

export const RegistrationModal = ({
    isOpen,
    onClose,
    serviceName,
}: RegistrationModalProps) => {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        name: "",
        phone: "",
        message: "",
        whatsapp: false,
        telegram: false,
        telegramNickname: "",
        max: false,
        maxLink: "",
    });
    const [errors, setErrors] = useState<Partial<FormData>>({});
    const [isSuccess, setIsSuccess] = useState(false);

    // Reset form when modal opens/closes
    useEffect(() => {
        if (!isOpen) {
            setFormData({
                name: "",
                phone: "",
                message: "",
                whatsapp: false,
                telegram: false,
                telegramNickname: "",
                max: false,
                maxLink: "",
            });
            setErrors({});
            setIsSuccess(false);
        }
    }, [isOpen]);

    const validateForm = () => {
        const newErrors: Partial<FormData> = {};

        if (!formData.name.trim()) {
            newErrors.name = "Введите ваше имя";
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "Введите номер телефона";
        }

        // Check if at least one contact method is selected
        const hasContactMethod = formData.whatsapp || formData.telegram || formData.max;
        if (!hasContactMethod) {
            toast({
                title: "Ошибка",
                description: "Выберите хотя бы один способ связи",
                variant: "destructive",
            });
            return false;
        }

        // Validate Telegram nickname if selected
        if (formData.telegram && !formData.telegramNickname.trim()) {
            newErrors.telegramNickname = "Введите ваш Telegram";
        }

        // Validate Max link if selected
        if (formData.max && !formData.maxLink.trim()) {
            newErrors.maxLink = "Введите ссылку на ваш аккаунт Max";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear error for this field
        if (errors[name as keyof FormData]) {
            setErrors((prev) => ({
                ...prev,
                [name]: undefined,
            }));
        }
    };

    const handleCheckboxChange = (name: string, checked: boolean) => {
        setFormData((prev) => ({
            ...prev,
            [name]: checked,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            // Prepare contact methods info
            const contactMethods = [];
            if (formData.whatsapp) contactMethods.push("WhatsApp");
            if (formData.telegram) contactMethods.push(`Telegram: @${formData.telegramNickname}`);
            if (formData.max) contactMethods.push(`Max: ${formData.maxLink}`);

            // Prepare the message for Telegram
            const telegramMessage = `
🏋️ <b>Новая запись к тренеру</b>

<b>Формат:</b> ${serviceName || "Не указан"}

<b>Имя:</b> ${formData.name}
<b>Телефон:</b> ${formData.phone}
<b>Способ связи:</b> ${contactMethods.join(", ")}
${formData.message ? `<b>Сообщение:</b> ${formData.message}` : ""}
      `.trim();

            // Get bot token from environment
            const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
            const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;

            if (!botToken || !chatId) {
                // If no Telegram config, just show success (for development)
                console.warn("Telegram credentials not configured. Using demo mode.");
                console.log("Form data:", formData);
                setIsSuccess(true);
                toast({
                    title: "Запрос отправлен! 🎉",
                    description:
                        "Спасибо за интерес к моим услугам. Я свяжусь с вами в ближайшее время.",
                });
                setTimeout(() => {
                    onClose();
                }, 2000);
                return;
            }

            // Send message to Telegram
            const response = await fetch(
                `https://api.telegram.org/bot${botToken}/sendMessage`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        chat_id: chatId,
                        text: telegramMessage,
                        parse_mode: "HTML",
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to send message to Telegram");
            }

            setIsSuccess(true);
            toast({
                title: "Запрос отправлен! 🎉",
                description:
                    "Спасибо за интерес к моим услугам. Я свяжусь с вами в ближайшее время.",
            });

            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (error) {
            console.error("Error sending form:", error);
            toast({
                title: "Ошибка",
                description:
                    "Не удалось отправить запрос. Пожалуйста, свяжитесь со мной в Телеграм.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Запись к тренеру</DialogTitle>
                    <DialogDescription>
                        {serviceName && (
                            <p className="text-base text-primary font-medium mt-2">
                                Формат: <span className="text-foreground">{serviceName}</span>
                            </p>
                        )}
                    </DialogDescription>
                </DialogHeader>

                {isSuccess ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in duration-300">
                        <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Спасибо за запрос!</h3>
                        <p className="text-muted-foreground">
                            Я свяжусь с вами в ближайшее время
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5 animate-in fade-in duration-300">
                        {/* Name Field */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Имя и фамилия *</Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="Ваше имя"
                                value={formData.name}
                                onChange={handleInputChange}
                                disabled={isLoading}
                                className={
                                    errors.name ? "border-red-500 focus-visible:ring-red-500" : ""
                                }
                            />
                            {errors.name && (
                                <div className="flex items-center gap-1 text-sm text-red-500">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.name}
                                </div>
                            )}
                        </div>

                        {/* Phone Field */}
                        <div className="space-y-2">
                            <Label htmlFor="phone">Номер телефона *</Label>
                            <Input
                                id="phone"
                                name="phone"
                                placeholder="+7 (XXX) XXX-XX-XX"
                                value={formData.phone}
                                onChange={handleInputChange}
                                disabled={isLoading}
                                className={
                                    errors.phone ? "border-red-500 focus-visible:ring-red-500" : ""
                                }
                            />
                            {errors.phone && (
                                <div className="flex items-center gap-1 text-sm text-red-500">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.phone}
                                </div>
                            )}
                        </div>

                        {/* Contact Method Selection */}
                        <div className="space-y-3">
                            <Label>Способ связи *</Label>
                            <div className="space-y-3">
                                {/* WhatsApp */}
                                <div className="flex items-center space-x-3">
                                    <Checkbox
                                        id="whatsapp"
                                        checked={formData.whatsapp}
                                        onCheckedChange={(checked) =>
                                            handleCheckboxChange("whatsapp", checked as boolean)
                                        }
                                        disabled={isLoading}
                                    />
                                    <Label
                                        htmlFor="whatsapp"
                                        className="font-normal cursor-pointer flex-1"
                                    >
                                        WhatsApp
                                    </Label>
                                </div>

                                {/* Telegram */}
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-3">
                                        <Checkbox
                                            id="telegram"
                                            checked={formData.telegram}
                                            onCheckedChange={(checked) =>
                                                handleCheckboxChange("telegram", checked as boolean)
                                            }
                                            disabled={isLoading}
                                        />
                                        <Label
                                            htmlFor="telegram"
                                            className="font-normal cursor-pointer flex-1"
                                        >
                                            Telegram
                                        </Label>
                                    </div>
                                    {formData.telegram && (
                                        <Input
                                            name="telegramNickname"
                                            placeholder="Ваш Telegram (без @)"
                                            value={formData.telegramNickname}
                                            onChange={handleInputChange}
                                            disabled={isLoading}
                                            className={
                                                errors.telegramNickname
                                                    ? "border-red-500 focus-visible:ring-red-500"
                                                    : ""
                                            }
                                        />
                                    )}
                                    {errors.telegramNickname && (
                                        <div className="flex items-center gap-1 text-sm text-red-500">
                                            <AlertCircle className="w-3 h-3" />
                                            {errors.telegramNickname}
                                        </div>
                                    )}
                                </div>

                                {/* Max */}
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-3">
                                        <Checkbox
                                            id="max"
                                            checked={formData.max}
                                            onCheckedChange={(checked) =>
                                                handleCheckboxChange("max", checked as boolean)
                                            }
                                            disabled={isLoading}
                                        />
                                        <Label htmlFor="max" className="font-normal cursor-pointer flex-1">
                                            Max
                                        </Label>
                                    </div>
                                    {formData.max && (
                                        <Input
                                            name="maxLink"
                                            placeholder="Ссылка на ваш аккаунт Max"
                                            value={formData.maxLink}
                                            onChange={handleInputChange}
                                            disabled={isLoading}
                                            className={
                                                errors.maxLink
                                                    ? "border-red-500 focus-visible:ring-red-500"
                                                    : ""
                                            }
                                        />
                                    )}
                                    {errors.maxLink && (
                                        <div className="flex items-center gap-1 text-sm text-red-500">
                                            <AlertCircle className="w-3 h-3" />
                                            {errors.maxLink}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Message Field */}
                        <div className="space-y-2">
                            <Label htmlFor="message">Сообщение</Label>
                            <Textarea
                                id="message"
                                name="message"
                                placeholder="Ваши вопросы или пожелания..."
                                value={formData.message}
                                onChange={handleInputChange}
                                disabled={isLoading}
                                rows={3}
                                className="resize-none"
                            />
                            <p className="text-xs text-muted-foreground">
                                Расскажите о своих целях, ограничениях по здоровью или других важных деталях
                            </p>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full gradient-button"
                            size="lg"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Отправка...
                                </>
                            ) : (
                                "Отправить запрос"
                            )}
                        </Button>

                        {/* Privacy Policy Text */}
                        <p className="text-xs text-muted-foreground text-center">
                            Нажимая на кнопку, вы соглашаетесь с{" "}
                            <button
                                type="button"
                                onClick={() => {
                                    window.open('/privacy', '_blank');
                                }}
                                className="text-primary hover:underline bg-transparent border-none cursor-pointer p-0"
                            >
                                политикой конфиденциальности
                            </button>
                        </p>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
};