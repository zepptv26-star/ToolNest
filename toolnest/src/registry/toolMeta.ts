import type { CategoryId } from './types.ts';

/**
 * Plain tool metadata (no React, no icons) so build scripts can read it with Node.
 * Icons are attached in tools.ts. To add a tool, add an entry here and an icon there.
 */
export interface ToolMeta {
  slug: string;
  name: string;
  category: CategoryId;
  /** One-line card description. */
  description: string;
  /** Longer intro shown at the top of the tool page and used as the meta description. */
  intro: string;
  keywords: string[];
  popular?: boolean;
  /** ISO date the tool was published; drives "Recently added". */
  addedAt: string;
}

export interface CategoryMeta { id: CategoryId; name: string; description: string }

export const categoryMeta: CategoryMeta[] = [
  { id: 'calculators', name: 'Calculators', description: 'Age, BMI, percentages, discounts and loans.' },
  { id: 'converters', name: 'Converters', description: 'Currency, units, temperature, cooking and data size.' },
  { id: 'text-writing', name: 'Text & Writing', description: 'Count words and compare versions of a text.' },
  { id: 'image-tools', name: 'Image Tools', description: 'Resize and compress images privately in your browser.' },
  { id: 'money-finance', name: 'Money & Finance', description: 'Savings, compound interest and profit margins.' },
  { id: 'productivity', name: 'Productivity', description: 'Stopwatch, countdown timer and alarm clock.' }
];

export const toolMeta: ToolMeta[] = [
  { slug: "age-calculator", name: "Age Calculator", category: "calculators", addedAt: "2026-11-22", popular: true,
    description: "Find your exact age in years, months and days.",
    intro: "Calculate your exact age in years, months, and days using your date of birth.",
    keywords: ["birthday", "date of birth", "days lived", "how old"] },
  { slug: "bmi-calculator", name: "BMI Calculator", category: "calculators", addedAt: "2026-11-22", popular: true,
    description: "Estimate body mass index in metric or imperial units.",
    intro: "Estimate your body mass index (BMI) using metric or imperial units. BMI is a general screening figure, not a medical diagnosis.",
    keywords: ["body mass index", "weight", "height", "health"] },
  { slug: "percentage-calculator", name: "Percentage Calculator", category: "calculators", addedAt: "2026-11-22", popular: true,
    description: "Percent of a number, increase, decrease and ratios.",
    intro: "Work out a percentage of a number, a percentage increase or decrease, or what percent one number is of another.",
    keywords: ["percent", "increase", "decrease", "ratio"] },
  { slug: "discount-calculator", name: "Discount Calculator", category: "calculators", addedAt: "2026-11-22",
    description: "See your savings and final price after a discount.",
    intro: "Enter a price and a discount to see how much you save and what you pay, with optional sales tax.",
    keywords: ["sale", "price", "savings", "tax", "off"] },
  { slug: "loan-calculator", name: "Loan Calculator", category: "calculators", addedAt: "2026-11-22", popular: true,
    description: "Monthly payment, total interest and amortization schedule.",
    intro: "Estimate monthly payments, total interest and a full amortization schedule for a fixed-rate loan.",
    keywords: ["mortgage", "payment", "interest", "amortization", "repayment"] },
  { slug: "currency-converter", name: "Currency Converter", category: "converters", addedAt: "2026-11-22", popular: true,
    description: "Convert between major currencies using live exchange rates.",
    intro: "Convert between major world currencies. Rates come from an external provider, with the source and update time shown.",
    keywords: ["exchange rate", "usd", "eur", "money", "forex"] },
  { slug: "unit-converter", name: "Unit Converter", category: "converters", addedAt: "2026-11-22", popular: true,
    description: "Length, weight, area, volume, speed and pressure.",
    intro: "Convert between common international units of length, weight, area, volume, speed and pressure.",
    keywords: ["metric", "imperial", "length", "weight", "area", "volume", "speed", "pressure"] },
  { slug: "temperature-converter", name: "Temperature Converter", category: "converters", addedAt: "2026-11-22",
    description: "Celsius, Fahrenheit and Kelvin, instantly.",
    intro: "Convert temperatures between Celsius, Fahrenheit and Kelvin as you type.",
    keywords: ["celsius", "fahrenheit", "kelvin", "degrees"] },
  { slug: "cooking-converter", name: "Cooking Measurement Converter", category: "converters", addedAt: "2026-11-22",
    description: "Cups, spoons, millilitres, ounces and grams.",
    intro: "Convert kitchen measurements. Volume and weight are different things, so grams need an ingredient density.",
    keywords: ["recipe", "cups", "tablespoons", "teaspoons", "ml", "grams", "baking"] },
  { slug: "data-storage-converter", name: "Data Storage Converter", category: "converters", addedAt: "2026-11-22",
    description: "Bytes to terabytes, in decimal or binary units.",
    intro: "Convert between bytes, KB, MB, GB and TB using decimal (1000) or binary (1024) units.",
    keywords: ["bytes", "kb", "mb", "gb", "tb", "file size"] },
  { slug: "word-counter", name: "Word Counter", category: "text-writing", addedAt: "2026-11-22", popular: true,
    description: "Count words, characters, sentences and reading time.",
    intro: "Paste or type text to count words, characters, sentences and paragraphs, and estimate reading time.",
    keywords: ["characters", "sentences", "paragraphs", "reading time", "essay"] },
  { slug: "text-comparison", name: "Text Comparison Tool", category: "text-writing", addedAt: "2026-11-22",
    description: "Highlight added and removed text between two versions.",
    intro: "Paste two versions of a text to see what was added and what was removed.",
    keywords: ["diff", "compare", "difference", "changes"] },
  { slug: "image-resizer", name: "Image Resizer", category: "image-tools", addedAt: "2026-11-22", popular: true,
    description: "Resize images in your browser and download the result.",
    intro: "Resize an image to exact dimensions. Everything happens in your browser, so your image is never uploaded.",
    keywords: ["resize", "dimensions", "width", "height", "photo", "picture"] },
  { slug: "image-compressor", name: "Image Compressor", category: "image-tools", addedAt: "2026-11-22",
    description: "Reduce image file size with adjustable quality.",
    intro: "Shrink JPEG and WebP images with adjustable quality and compare sizes before downloading. Processing stays in your browser.",
    keywords: ["compress", "optimize", "jpeg", "webp", "png", "file size"] },
  { slug: "savings-calculator", name: "Savings Calculator", category: "money-finance", addedAt: "2026-11-22",
    description: "Estimate savings growth with regular contributions.",
    intro: "Estimate how savings could grow with regular contributions and interest. Results are estimates, not promises.",
    keywords: ["save", "contributions", "interest", "future balance"] },
  { slug: "compound-interest-calculator", name: "Compound Interest Calculator", category: "money-finance", addedAt: "2026-11-22", popular: true,
    description: "See how interest compounds over time.",
    intro: "Estimate the growth of a balance with compound interest and optional contributions. Results are estimates, not promises.",
    keywords: ["investment", "compounding", "principal", "growth"] },
  { slug: "profit-margin-calculator", name: "Profit Margin Calculator", category: "money-finance", addedAt: "2026-11-22",
    description: "Gross profit, margin and markup from cost and price.",
    intro: "Calculate gross profit, profit margin and markup from your cost and selling price.",
    keywords: ["markup", "revenue", "cost", "selling price", "business"] },
  { slug: "stopwatch", name: "Stopwatch", category: "productivity", addedAt: "2026-11-22",
    description: "Start, stop, lap and reset with millisecond display.",
    intro: "A simple stopwatch with lap times. Timing is based on the system clock, so it stays accurate.",
    keywords: ["timer", "lap", "time", "chronometer"] },
  { slug: "countdown-timer", name: "Countdown Timer", category: "productivity", addedAt: "2026-11-22", popular: true,
    description: "Count down from hours, minutes and seconds.",
    intro: "Set a countdown with start, pause, resume and reset, plus an optional sound when time is up.",
    keywords: ["timer", "countdown", "alarm", "minutes"] },
  { slug: "alarm-clock", name: "Alarm Clock", category: "productivity", addedAt: "2026-11-22",
    description: "Set a labelled alarm that rings while the tab is open.",
    intro: "Set an alarm for a time of day. It only rings while this page stays open in your browser.",
    keywords: ["alarm", "wake", "reminder", "clock"] }
];
