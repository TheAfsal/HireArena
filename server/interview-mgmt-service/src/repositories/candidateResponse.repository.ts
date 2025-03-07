class CandidateResponseRepository {
  private prisma;
  constructor(prisma) {
    this.prisma = prisma;
  }

  async saveCandidateResponse(
    interviewId: string,
    questionId: string,
    selectedAnswer: string,
    isCorrect: boolean
  ) {
    console.log(selectedAnswer);

    return this.prisma.candidateResponse.create({
      data: {
        interviewId,
        questionId,
        selectedAnswer,
        isCorrect,
      },
    });
  }
  
  async getResponsesByInterviewId(interviewId: string) {
    return this.prisma.candidateResponse.findMany({
      where: { interviewId },
      select: {
        questionId: true,
        selectedAnswer: true,
        isCorrect: true,
      },
    });
  }
}

export default CandidateResponseRepository;
