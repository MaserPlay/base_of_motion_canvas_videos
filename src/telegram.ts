import { Bot } from "grammy"

export const TelegramBotToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN

export const TelegramBot = new Bot(TelegramBotToken)