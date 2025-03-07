export interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
}

export const questions: Question[] = [
  {
    id: 1,
    question: "If a train travels at 80 km/hr, how long will it take to cover a distance of 320 km?",
    options: ["3 hours", "4 hours", "5 hours", "6 hours"],
    correctAnswer: 1,
  },
  {
    id: 2,
    question: "A is twice as old as B. If A is 36 years old, how old is B?",
    options: ["12 years", "18 years", "24 years", "72 years"],
    correctAnswer: 1,
  },
  {
    id: 3,
    question: "If 8 men can build a wall in 10 days, how many men are needed to build the same wall in 5 days?",
    options: ["4 men", "8 men", "16 men", "20 men"],
    correctAnswer: 2,
  },
  {
    id: 4,
    question: "What is the next number in the sequence: 2, 4, 8, 16, ...?",
    options: ["24", "30", "32", "64"],
    correctAnswer: 2,
  },
  {
    id: 5,
    question: "If a shirt costs $25 after a 20% discount, what was its original price?",
    options: ["$20", "$30", "$31.25", "$45"],
    correctAnswer: 2,
  },
  {
    id: 6,
    question: "Which of the following is not a prime number?",
    options: ["17", "19", "21", "23"],
    correctAnswer: 2,
  },
  {
    id: 7,
    question: "If x + y = 10 and x - y = 4, what is the value of x?",
    options: ["3", "6", "7", "8"],
    correctAnswer: 2,
  },
  {
    id: 8,
    question:
      "A car travels at 60 km/hr for 2 hours and then at 40 km/hr for 3 hours. What is the average speed for the entire journey?",
    options: ["48 km/hr", "50 km/hr", "52 km/hr", "56 km/hr"],
    correctAnswer: 0,
  },
  {
    id: 9,
    question: "If 3/4 of a number is 18, what is the number?",
    options: ["13.5", "21", "24", "27"],
    correctAnswer: 2,
  },
  {
    id: 10,
    question: "Which of the following fractions is the largest?",
    options: ["3/5", "4/7", "5/9", "6/11"],
    correctAnswer: 0,
  },
  {
    id: 11,
    question: "If a rectangle has a length of 12 cm and a width of 8 cm, what is its area?",
    options: ["20 cm²", "64 cm²", "96 cm²", "120 cm²"],
    correctAnswer: 2,
  },
  {
    id: 12,
    question: "What is the value of 2³ × 5²?",
    options: ["100", "125", "150", "200"],
    correctAnswer: 3,
  },
  {
    id: 13,
    question: "If a = 3 and b = 4, what is the value of a² + b²?",
    options: ["7", "12", "25", "49"],
    correctAnswer: 2,
  },
  {
    id: 14,
    question:
      "A box contains 3 red balls, 4 green balls, and 5 blue balls. If a ball is drawn at random, what is the probability of drawing a green ball?",
    options: ["1/4", "1/3", "3/8", "4/12"],
    correctAnswer: 2,
  },
  {
    id: 15,
    question: "If the angles in a triangle are in the ratio 2:3:4, what is the measure of the largest angle?",
    options: ["40°", "60°", "80°", "100°"],
    correctAnswer: 2,
  },
  {
    id: 16,
    question: "Which of the following is a solution to the equation 2x - 5 = 11?",
    options: ["3", "8", "13", "16"],
    correctAnswer: 1,
  },
  {
    id: 17,
    question: "If a company's profit increased by 15% to $69,000, what was the original profit?",
    options: ["$58,650", "$60,000", "$79,350", "$86,250"],
    correctAnswer: 1,
  },
  {
    id: 18,
    question: "What is the value of log₁₀(100)?",
    options: ["1", "2", "10", "100"],
    correctAnswer: 1,
  },
  {
    id: 19,
    question:
      "If 5 workers can complete a task in 12 days, how many days will it take for 3 workers to complete the same task?",
    options: ["7.2 days", "15 days", "20 days", "25 days"],
    correctAnswer: 2,
  },
  {
    id: 20,
    question: "What is the sum of the first 10 natural numbers?",
    options: ["45", "50", "55", "66"],
    correctAnswer: 2,
  },
  {
    id: 21,
    question: "If a circle has a radius of 7 cm, what is its circumference? (Use π = 22/7)",
    options: ["14 cm", "22 cm", "44 cm", "154 cm"],
    correctAnswer: 2,
  },
  {
    id: 22,
    question: "Which of the following is equivalent to 0.125?",
    options: ["1/4", "1/8", "1/10", "1/12"],
    correctAnswer: 1,
  },
  {
    id: 23,
    question: "If a cube has a volume of 27 cubic cm, what is the length of its edge?",
    options: ["3 cm", "6 cm", "9 cm", "27 cm"],
    correctAnswer: 0,
  },
  {
    id: 24,
    question: "What is the value of (3 + 4) × (8 - 5)?",
    options: ["9", "15", "21", "35"],
    correctAnswer: 2,
  },
  {
    id: 25,
    question:
      "If a person walks at 4 km/hr instead of 5 km/hr, they take 15 minutes longer to cover a certain distance. What is the distance?",
    options: ["4 km", "5 km", "10 km", "20 km"],
    correctAnswer: 1,
  },
]

