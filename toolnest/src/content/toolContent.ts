export interface ToolContent {
  howTo: string[];
  howItWorks: string;
  faq: { q: string; a: string }[];
  related: string[];
}

/** Original help content for each tool page, keyed by tool slug. */
export const toolContent: Record<string, ToolContent> = {
  'age-calculator': {
    howTo: ['Choose your date of birth with the date picker, or type it as YYYY-MM-DD.', 'Your age appears immediately in years, months and days, together with total days lived.', 'Check the countdown to see how many days remain until your next birthday.'],
    howItWorks: 'The tool counts whole months between your birth date and today, then counts the remaining days from the most recent monthly anniversary. When a month is shorter than your birth day (for example 31 January), the anniversary falls on the last day of that shorter month. Total days lived is the exact number of calendar days between the two dates, so leap days are included automatically.',
    faq: [
      { q: 'How are leap-year birthdays handled?', a: 'If you were born on 29 February, your birthday is counted on 28 February in years that are not leap years. Leap years are those divisible by 4, except century years not divisible by 400.' },
      { q: 'Which date is used as "today"?', a: 'Your device\'s current local date. Nothing is sent anywhere, so your date of birth stays in your browser.' },
      { q: 'Can I calculate the age on a different date?', a: 'Not yet. The calculator always measures up to today. For the gap between two arbitrary dates, a date difference tool would be the right fit.' }
    ],
    related: ['percentage-calculator', 'countdown-timer', 'stopwatch']
  },
  'bmi-calculator': {
    howTo: ['Choose metric (kilograms and centimetres) or imperial (pounds, feet and inches).', 'Enter your weight and height.', 'Read your BMI and the standard adult category, then compare it with the table below the result.'],
    howItWorks: 'BMI is weight in kilograms divided by height in metres squared. For imperial units the tool uses 703 × pounds ÷ inches squared, which gives the same result. The categories are the widely used adult cut-offs: under 18.5 underweight, 18.5 to 24.9 normal weight, 25 to 29.9 overweight, and 30 or above obesity.',
    faq: [
      { q: 'Is BMI a diagnosis?', a: 'No. BMI is a simple screening number. It does not measure body fat, muscle, bone density or where fat is stored, so it can be misleading for athletes, older adults and some ethnic groups.' },
      { q: 'Does this work for children?', a: 'No. Children and teenagers are assessed with age- and sex-specific growth charts, which this tool does not use.' },
      { q: 'What should I do with my result?', a: 'Treat it as a starting point for a conversation with a doctor or dietitian, who can consider your whole health picture.' }
    ],
    related: ['percentage-calculator', 'unit-converter', 'temperature-converter']
  },
  'percentage-calculator': {
    howTo: ['Pick the kind of percentage question you want to answer from the drop-down.', 'Fill in the two numbers shown.', 'The answer and a plain-language sentence appear straight away, ready to copy.'],
    howItWorks: 'Percent of a number: (percentage ÷ 100) × number. What percent X is of Y: (X ÷ Y) × 100. Percentage change: (new − old) ÷ |old| × 100, positive for an increase and negative for a decrease. Increasing by p% multiplies by (1 + p ÷ 100); decreasing multiplies by (1 − p ÷ 100).',
    faq: [
      { q: 'Why can\'t the starting value be zero?', a: 'Percentage change divides by the starting value, and dividing by zero is undefined. Likewise, you cannot ask what percent something is of zero.' },
      { q: 'Why is a 50% increase followed by a 50% decrease not back to the start?', a: 'The second percentage is taken from the larger number. 100 up 50% is 150; 150 down 50% is 75.' },
      { q: 'Are negative numbers allowed?', a: 'Yes. Negative inputs work for the calculations where they make mathematical sense.' }
    ],
    related: ['discount-calculator', 'profit-margin-calculator', 'compound-interest-calculator']
  },
  'discount-calculator': {
    howTo: ['Enter the original price and the discount percentage.', 'Optionally add a sales tax rate.', 'See how much you save, the price after discount, the tax, and the final price.'],
    howItWorks: 'Savings = price × discount ÷ 100. Price after discount = price − savings. If you enter sales tax, it is applied to the discounted price: tax = discounted price × tax ÷ 100, and the final price is the discounted price plus tax. This matches how most shops calculate tax, but rules differ between regions.',
    faq: [
      { q: 'Is tax applied before or after the discount?', a: 'This tool applies tax after the discount, which is the usual retail rule. If your local rules differ, leave the tax field empty and add tax yourself.' },
      { q: 'Can I stack two discounts?', a: 'Calculate the first discount, then use the final price as the original price for the second. Two discounts of 20% and 10% are not the same as 30%.' },
      { q: 'Which currency does it use?', a: 'None. Enter amounts in any currency; the result is in the same currency.' }
    ],
    related: ['percentage-calculator', 'profit-margin-calculator', 'currency-converter']
  },
  'loan-calculator': {
    howTo: ['Enter the loan amount, the annual interest rate and the term in years (and extra months if needed).', 'Read the monthly payment, total interest and total repayment.', 'Scroll the amortization schedule to see how each payment splits between interest and principal.'],
    howItWorks: 'The tool uses the standard fixed-rate amortization formula: payment = P × i ÷ (1 − (1 + i)^−n), where P is the amount borrowed, i is the monthly rate (annual rate ÷ 12 ÷ 100) and n is the number of monthly payments. Each month, interest is the remaining balance × i; the rest of the payment reduces the balance. At a 0% rate the payment is simply P ÷ n.',
    faq: [
      { q: 'Why does my lender show a different payment?', a: 'Lenders may include fees, insurance or taxes, compound interest differently, use daily interest, or round at different steps. Use this as an estimate and rely on your loan documents.' },
      { q: 'Does this support variable rates or extra payments?', a: 'No. It assumes one fixed rate and equal monthly payments made at the end of each month.' },
      { q: 'Why is so much of the early payment interest?', a: 'Interest is charged on the remaining balance, which is largest at the start. Over time the interest share falls and the principal share rises.' }
    ],
    related: ['compound-interest-calculator', 'savings-calculator', 'percentage-calculator']
  },
  'currency-converter': {
    howTo: ['Enter the amount you want to convert.', 'Choose the "from" and "to" currencies. The swap button reverses them.', 'Read the result and the exchange-rate date. If rates cannot load, switch to "Enter my own rate".'],
    howItWorks: 'The tool fetches reference exchange rates from the Frankfurter service, which republishes European Central Bank rates, then multiplies your amount by the rate for the chosen pair. Rates are published on working days, so weekends show the last working day\'s rates. The rate date and the time they were fetched are shown beneath the result, and rates are cached in your browser for ten minutes.',
    faq: [
      { q: 'Are these live market rates?', a: 'No. They are daily reference rates, which are fine for planning and comparison but not for trading.' },
      { q: 'Why does my bank give a different amount?', a: 'Banks, card networks and money-transfer services use their own rates and usually add a margin or fee.' },
      { q: 'What if the service is down?', a: 'You will see an error rather than made-up numbers. You can retry, or enter your own rate manually.' }
    ],
    related: ['unit-converter', 'discount-calculator', 'percentage-calculator']
  },
  'unit-converter': {
    howTo: ['Choose a category: length, weight, area, volume, speed or pressure.', 'Enter a value and pick the units to convert from and to.', 'Use the swap button to reverse the conversion.'],
    howItWorks: 'Every unit is defined by its exact size in a base unit (metre, kilogram, square metre, litre, metre per second or pascal). To convert, the value is multiplied by the source unit\'s size and divided by the target unit\'s size. Imperial and US units use their internationally agreed definitions, such as 1 inch = 25.4 mm exactly and 1 pound = 0.45359237 kg exactly.',
    faq: [
      { q: 'Are US and UK gallons different?', a: 'Yes. A US gallon is about 3.785 litres and a UK (imperial) gallon is about 4.546 litres. Both are available in the volume category.' },
      { q: 'Does it convert temperature?', a: 'Temperature has its own converter because Celsius, Fahrenheit and Kelvin do not share a simple zero point.' },
      { q: 'How precise are the results?', a: 'Results are shown to up to 8 decimal places, enough for everyday and most technical use.' }
    ],
    related: ['temperature-converter', 'cooking-converter', 'data-storage-converter']
  },
  'temperature-converter': {
    howTo: ['Type a temperature.', 'Choose whether it is in Celsius, Fahrenheit or Kelvin.', 'All three values appear instantly.'],
    howItWorks: 'Everything is converted through Celsius. Fahrenheit to Celsius: (°F − 32) × 5 ÷ 9. Celsius to Fahrenheit: °C × 9 ÷ 5 + 32. Kelvin is Celsius + 273.15. The tool rejects values below absolute zero (−273.15 °C, −459.67 °F or 0 K), which cannot exist physically.',
    faq: [
      { q: 'At what temperature do Celsius and Fahrenheit match?', a: 'At −40, where −40 °C equals −40 °F.' },
      { q: 'Why is there no degree symbol for Kelvin?', a: 'Kelvin is an absolute scale and is written simply as K, not °K.' },
      { q: 'Are negative temperatures allowed?', a: 'Yes, as long as they are not below absolute zero.' }
    ],
    related: ['unit-converter', 'cooking-converter', 'bmi-calculator']
  },
  'cooking-converter': {
    howTo: ['Enter an amount and choose the units to convert from and to.', 'Pick the cup system you use: US (237 mL) or metric (250 mL).', 'If grams are involved, choose the ingredient so the tool can estimate its weight.'],
    howItWorks: 'Volume units are converted using their size in millilitres. Grams depend on density, so each ingredient has a typical weight per US cup (for example about 125 g for spooned all-purpose flour and 200 g for granulated sugar). Converting between volume and grams multiplies or divides by that density. Converting between two volume units never needs an ingredient.',
    faq: [
      { q: 'Why can\'t I convert cups to grams without choosing an ingredient?', a: 'A cup measures space, a gram measures weight. A cup of honey weighs much more than a cup of flour, so the tool needs to know what you are measuring.' },
      { q: 'How accurate are the gram values?', a: 'They are typical averages. How you scoop, humidity and brand can change a cup of flour by 20 g or more. A kitchen scale is more reliable for baking.' },
      { q: 'Which cup size should I pick?', a: 'Use US for most American recipes and metric (250 mL) for recipes from Australia, New Zealand and much of Europe.' }
    ],
    related: ['unit-converter', 'temperature-converter', 'countdown-timer']
  },
  'data-storage-converter': {
    howTo: ['Choose decimal (1 KB = 1000 bytes) or binary (1 KiB = 1024 bytes).', 'Enter a size and choose its unit.', 'See the equivalent in bytes, kilobytes, megabytes, gigabytes and terabytes.'],
    howItWorks: 'Decimal units multiply by 1000 at each step (KB, MB, GB, TB). Binary units multiply by 1024 (KiB, MiB, GiB, TiB). The tool first converts your value to bytes using the chosen standard and then divides by the size of each target unit.',
    faq: [
      { q: 'Why does my 1 TB drive show less space?', a: 'Drive makers use decimal terabytes (10^12 bytes), while many operating systems report binary units (2^40 bytes per TiB). 1 TB is about 0.909 TiB, often shown as roughly 931 GB.' },
      { q: 'Should I use decimal or binary?', a: 'Use decimal for storage sizes and network speeds on product labels, and binary when matching how an operating system or memory reports sizes.' },
      { q: 'Does it include bits?', a: 'Not at the moment. It covers bytes through terabytes.' }
    ],
    related: ['image-compressor', 'unit-converter', 'word-counter']
  },
  'word-counter': {
    howTo: ['Type or paste your text into the box.', 'Counts update as you type: words, characters, characters without spaces, sentences and paragraphs.', 'Use "Copy counts" to copy a summary, or "Clear" to start again.'],
    howItWorks: 'Words are groups of characters separated by whitespace. Characters are counted as Unicode characters, so an emoji counts as one. Sentences end at a full stop, question mark, exclamation mark, or their Japanese equivalents. Paragraphs are blocks of text separated by blank lines. Reading time assumes about 238 words per minute and speaking time about 130.',
    faq: [
      { q: 'Does it count Japanese or Chinese text correctly?', a: 'Character counts are correct. Word counts depend on spaces, so text written without spaces is counted in spaced groups rather than true words.' },
      { q: 'Is my text uploaded?', a: 'No. Counting happens in your browser and your text is never sent or stored.' },
      { q: 'Why does my word processor show a different count?', a: 'Different programs treat hyphens, numbers and symbols differently. Differences of a few words are normal.' }
    ],
    related: ['text-comparison', 'stopwatch', 'data-storage-converter']
  },
  'text-comparison': {
    howTo: ['Paste the original text on the left and the changed text on the right.', 'Added words are highlighted in green and removed words in red with a strikethrough.', 'Copy the marked-up result, or clear both boxes to compare something new.'],
    howItWorks: 'Both texts are split into words and spaces, then compared with the longest-common-subsequence method: the longest run of words that appear in the same order in both texts is kept as unchanged, and everything else is marked as added or removed. The comparison is word by word and case-sensitive.',
    faq: [
      { q: 'Does it compare line by line?', a: 'No, it compares word by word, which is easier to read for prose, essays and short documents.' },
      { q: 'Is there a size limit?', a: 'Yes. Each text can be about 2,000 words. Longer texts could freeze the browser, so the tool asks you to shorten them.' },
      { q: 'Is my text kept private?', a: 'Yes. The comparison runs in your browser and nothing is uploaded.' }
    ],
    related: ['word-counter', 'stopwatch', 'image-compressor']
  },
  'image-resizer': {
    howTo: ['Choose an image from your device.', 'Enter a new width or height. With "Maintain aspect ratio" on, the other value updates automatically.', 'Pick an output format and quality, click Resize image, then download the result.'],
    howItWorks: 'The image is drawn onto an HTML canvas at the new size using high-quality smoothing, then exported as a new file. Everything runs inside your browser. JPEG output has no transparency, so transparent areas are filled with white. Images are limited to 25 MB and 50 million pixels to keep your browser stable.',
    faq: [
      { q: 'Is my image uploaded?', a: 'No. Your image never leaves your device.' },
      { q: 'Why does an enlarged image look blurry?', a: 'Enlarging cannot create detail that was not captured. For the sharpest results, resize down rather than up.' },
      { q: 'Which format should I choose?', a: 'JPEG suits photos, PNG suits graphics and transparency, and WebP often gives smaller files at similar quality.' }
    ],
    related: ['image-compressor', 'data-storage-converter', 'unit-converter']
  },
  'image-compressor': {
    howTo: ['Choose a JPEG, PNG, WebP, GIF or BMP image.', 'Pick JPEG or WebP and adjust the quality slider. The result updates automatically.', 'Compare before and after, check the sizes, and download the compressed image.'],
    howItWorks: 'The image is re-encoded in your browser at the quality you choose. JPEG and WebP are lossy formats: lower quality discards fine detail to shrink the file. PNG is lossless, so quality does not apply and the file may not get smaller. If the result is not smaller than the original, the tool tells you instead of hiding it.',
    faq: [
      { q: 'What quality should I use?', a: 'Around 70 to 85 is a good balance for photos. Go lower for thumbnails, and compare the preview to make sure it still looks fine.' },
      { q: 'Why did my file get bigger?', a: 'Files that are already well compressed can grow when re-encoded. Try a lower quality or WebP.' },
      { q: 'Is my image uploaded?', a: 'No. Compression runs entirely in your browser.' }
    ],
    related: ['image-resizer', 'data-storage-converter', 'word-counter']
  },
  'savings-calculator': {
    howTo: ['Enter your starting savings (it can be zero) and a regular contribution.', 'Choose how often you contribute and enter the expected annual interest rate and number of years.', 'Read the estimated balance, total contributions and interest, plus the year-by-year table.'],
    howItWorks: 'Each period, the balance earns interest at the annual rate divided by the number of periods per year, and your contribution is added at the end of the period. Contributions and compounding share the same frequency. The result is the starting balance grown at that rate plus the future value of all contributions. With a 0% rate the tool simply adds up what you put in.',
    faq: [
      { q: 'Is this a guarantee of what I will have?', a: 'No. It is an estimate based on a fixed rate. Real interest rates change, and investments can lose value.' },
      { q: 'Are taxes and inflation included?', a: 'No. Taxes, fees and inflation will reduce what your savings can actually buy.' },
      { q: 'What is the difference between this and the compound interest calculator?', a: 'This one ties compounding to your contribution schedule. The compound interest calculator lets you pick the compounding frequency separately.' }
    ],
    related: ['compound-interest-calculator', 'loan-calculator', 'percentage-calculator']
  },
  'compound-interest-calculator': {
    howTo: ['Enter the starting amount, annual interest rate and number of years.', 'Choose how often interest compounds, and optionally add a monthly contribution.', 'Review the final balance, total interest and the year-by-year breakdown.'],
    howItWorks: 'With compounding n times per year at annual rate r, each period earns r ÷ n. Without contributions the balance after t years is P × (1 + r ÷ n)^(n × t). Monthly contributions are added at the end of each month, and the tool converts your compounding rate into an equivalent monthly rate so both work together correctly.',
    faq: [
      { q: 'Does compounding more often make a big difference?', a: 'A little. At 5% over 10 years, 1,000 grows to about 1,628.89 compounded yearly and 1,647.01 compounded monthly.' },
      { q: 'Can the result be relied on for investments?', a: 'No. It assumes a constant rate, which real investments do not provide. Use it to compare scenarios, not to predict returns.' },
      { q: 'Are fees or taxes included?', a: 'No. Both would lower the real result.' }
    ],
    related: ['savings-calculator', 'loan-calculator', 'percentage-calculator']
  },
  'profit-margin-calculator': {
    howTo: ['Enter your cost price and your selling price per unit.', 'Optionally enter the quantity sold.', 'Read revenue, gross profit, profit margin and markup.'],
    howItWorks: 'Revenue = selling price × quantity. Gross profit = revenue − total cost. Margin = gross profit ÷ revenue × 100. Markup = gross profit ÷ cost × 100. Margin is always lower than markup for a profitable sale, because it is measured against the larger number.',
    faq: [
      { q: 'What is the difference between margin and markup?', a: 'Margin is profit as a percentage of the selling price; markup is profit as a percentage of cost. Cost 60 and price 100 gives a 40% margin and a 66.7% markup.' },
      { q: 'What price do I need for a target margin?', a: 'Divide the cost by (1 − margin). For a 40% margin on a cost of 60, the price is 60 ÷ 0.6 = 100.' },
      { q: 'Does this include overheads?', a: 'No. It shows gross profit only, before rent, wages, shipping, tax and other expenses.' }
    ],
    related: ['discount-calculator', 'percentage-calculator', 'compound-interest-calculator']
  },
  'stopwatch': {
    howTo: ['Press Start to begin timing.', 'Press Lap to record a split without stopping.', 'Press Stop to pause, Start again to resume, or Clear to reset everything.'],
    howItWorks: 'The stopwatch records the start moment with the browser\'s high-resolution clock and works out the elapsed time from the difference each time the display updates, rather than counting ticks. That keeps it accurate even if the page is slow or updates are delayed. Lap time is the time since the previous lap.',
    faq: [
      { q: 'Does it keep running if I switch tabs?', a: 'Yes. Because it uses the clock, the time is correct when you return, though the display may pause while the tab is hidden.' },
      { q: 'How accurate is it?', a: 'Accurate to a few milliseconds on most devices. The display shows hundredths of a second.' },
      { q: 'Are laps saved?', a: 'Only while the page is open. Use "Copy laps" to keep them.' }
    ],
    related: ['countdown-timer', 'alarm-clock', 'age-calculator']
  },
  'countdown-timer': {
    howTo: ['Enter hours, minutes and seconds.', 'Press Start. You can Pause and Resume at any time, or Reset to begin again.', 'Leave "Play a sound when time is up" on if you want an audible alert.'],
    howItWorks: 'When you press Start, the timer stores the exact moment it should finish and recalculates the remaining time from the system clock several times a second, instead of subtracting one second per tick. That keeps it accurate even when the browser delays timers. Pausing saves the remaining time and resuming sets a new finish moment.',
    faq: [
      { q: 'Will the sound play if the tab is in the background?', a: 'Usually, but browsers can delay sounds in background or closed tabs, and your device volume must be on. Keep the tab visible for important timers.' },
      { q: 'What is the maximum time?', a: '99 hours.' },
      { q: 'Why does the tab title show the time?', a: 'So you can see the countdown while working in another tab.' }
    ],
    related: ['stopwatch', 'alarm-clock', 'cooking-converter']
  },
  'alarm-clock': {
    howTo: ['Choose a time and, optionally, a label.', 'Press Set alarm. The alarm is set for the next time that clock time occurs, today or tomorrow.', 'When it rings, press Stop, or Snooze to be reminded in 5 minutes.'],
    howItWorks: 'The page checks the current time every second and when the chosen time is reached it plays a repeating beep and shows an on-screen alert. Checks also run when you return to the tab. Because everything runs in the page, there is no server involved and nothing is stored.',
    faq: [
      { q: 'Will it wake me up in the morning?', a: 'It cannot be relied on for that. It only rings while this page is open, your device is awake and the volume is on. Use your phone\'s built-in alarm for anything important.' },
      { q: 'Are my alarms saved if I reload?', a: 'No. Alarms exist only while the page is open.' },
      { q: 'How many alarms can I set?', a: 'Up to ten at a time.' }
    ],
    related: ['countdown-timer', 'stopwatch', 'age-calculator']
  }
};
