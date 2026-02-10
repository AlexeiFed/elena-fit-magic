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
import { useI18n } from "@/hooks/useI18n";

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
    const { t } = useI18n();
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
    // SEC-012: Honeypot-поле для защиты от ботов (скрытое, человек не заполнит)
    const [honeypot, setHoneypot] = useState("");

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
            newErrors.name = t("registration.nameError");
        }

        if (!formData.phone.trim()) {
            newErrors.phone = t("registration.phoneError");
        } else if (!/^\+?[\d\s\-()]{7,18}$/.test(formData.phone.trim())) {
            newErrors.phone = t("registration.phoneFormatError");
        }

        // Check if at least one contact method is selected
        const hasContactMethod = formData.whatsapp || formData.telegram || formData.max;
        if (!hasContactMethod) {
            toast({
                title: t("registration.error"),
                description: t("registration.errorContact"),
                variant: "destructive",
            });
            return false;
        }

        // Validate Telegram nickname if selected
        if (formData.telegram && !formData.telegramNickname.trim()) {
            newErrors.telegramNickname = t("registration.telegramError");
        }

        // Validate Max link if selected
        if (formData.max && !formData.maxLink.trim()) {
            newErrors.maxLink = t("registration.maxError");
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        // Real-time валидация телефона: только цифры, +, пробелы, дефисы, скобки
        if (name === "phone") {
            const hasLetters = /[a-zA-Zа-яА-ЯёЁ]/.test(value);
            if (hasLetters) {
                setErrors((prev) => ({
                    ...prev,
                    phone: t("registration.phoneFormatError"),
                }));
                return;
            }
            // Очищаем ошибку если ввод корректный
            if (errors.phone) {
                setErrors((prev) => ({ ...prev, phone: undefined }));
            }
        }

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
        // Очищаем ошибки связанных полей при снятии чекбокса
        if (!checked) {
            if (name === "telegram") {
                setErrors((prev) => ({ ...prev, telegramNickname: undefined }));
            }
            if (name === "max") {
                setErrors((prev) => ({ ...prev, maxLink: undefined }));
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            // Подготовка структурированных данных для сервера (SEC-013: сервер сам собирает сообщение)
            const contactMethods: { type: string; value?: string }[] = [];
            if (formData.whatsapp) contactMethods.push({ type: "whatsapp" });
            if (formData.telegram) contactMethods.push({ type: "telegram", value: formData.telegramNickname });
            if (formData.max) contactMethods.push({ type: "max", value: formData.maxLink });

            const payload = {
                name: formData.name,
                phone: formData.phone,
                message: formData.message,
                service: serviceName || "",
                contactMethods,
                // SEC-012: Honeypot — если заполнено, сервер отклонит запрос
                website: honeypot,
            };

            // In development (localhost), use demo mode
            const isDev = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

            if (isDev) {
                console.warn("Development mode: form data not sent to Telegram.");
                console.log("Form payload:", payload);
                setIsSuccess(true);
                toast({
                    title: t("registration.success") + " 🎉",
                    description: t("registration.successMessage"),
                });
                setTimeout(() => {
                    onClose();
                }, 2000);
                return;
            }

            // Отправка структурированных данных — сервер сам формирует сообщение и санитизирует ввод
            const response = await fetch("/api/send-telegram.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("Failed to send message");
            }

            setIsSuccess(true);
            toast({
                title: t("registration.success") + " 🎉",
                description: t("registration.successMessage"),
            });

            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (error) {
            console.error("Error sending form:", error);
            toast({
                title: t("registration.error"),
                description: t("registration.errorSend"),
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
                    <DialogTitle>{t("registration.title")}</DialogTitle>
                    {serviceName && (
                        <DialogDescription asChild>
                            <div className="text-base text-primary font-medium mt-2">
                                {t("registration.format")} <span className="text-foreground">{t(`serviceFormat.${serviceName}`, {}) || serviceName}</span>
                            </div>
                        </DialogDescription>
                    )}
                </DialogHeader>

                {isSuccess ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in duration-300">
                        <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">{t("registration.success")}</h3>
                        <p className="text-muted-foreground">
                            {t("registration.successMessage")}
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5 animate-in fade-in duration-300">
                        {/* Name Field */}
                        <div className="space-y-2">
                            <Label htmlFor="name">{t("registration.name")}</Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder={t("registration.namePlaceholder")}
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

                        {/* SEC-012: Honeypot — скрытое поле-ловушка для ботов */}
                        <div
                            aria-hidden="true"
                            style={{
                                position: "absolute",
                                left: "-9999px",
                                top: "-9999px",
                                opacity: 0,
                                height: 0,
                                overflow: "hidden",
                            }}
                        >
                            <label htmlFor="website">Website</label>
                            <input
                                type="text"
                                id="website"
                                name="website"
                                autoComplete="off"
                                tabIndex={-1}
                                value={honeypot}
                                onChange={(e) => setHoneypot(e.target.value)}
                            />
                        </div>

                        {/* Phone Field */}
                        <div className="space-y-2">
                            <Label htmlFor="phone">{t("registration.phone")}</Label>
                            <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                placeholder={t("registration.phonePlaceholder")}
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
                            <Label>{t("registration.contactMethod")}</Label>
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
                                        {t("registration.whatsapp")}
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
                                            {t("registration.telegram")}
                                        </Label>
                                    </div>
                                    {formData.telegram && (
                                        <Input
                                            name="telegramNickname"
                                            placeholder={t("registration.telegramPlaceholder")}
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
                                            {t("registration.max")}
                                        </Label>
                                    </div>
                                    {formData.max && (
                                        <Input
                                            name="maxLink"
                                            placeholder={t("registration.maxPlaceholder")}
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
                            <Label htmlFor="message">{t("registration.message")}</Label>
                            <Textarea
                                id="message"
                                name="message"
                                placeholder={t("registration.messagePlaceholder")}
                                value={formData.message}
                                onChange={handleInputChange}
                                disabled={isLoading}
                                rows={3}
                                className="resize-none"
                            />
                            <p className="text-xs text-muted-foreground">
                                {t("registration.messageHint")}
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
                                    {t("registration.submitting")}
                                </>
                            ) : (
                                t("registration.submit")
                            )}
                        </Button>

                        {/* Privacy Policy Text */}
                        <p className="text-xs text-muted-foreground text-center">
                            {t("registration.privacy")}{" "}
                            <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                {t("registration.privacyLink")}
                            </a>
                        </p>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
};