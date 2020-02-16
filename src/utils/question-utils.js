import QuestionType from 'models/question-type'

export function getOptionsDesc(question) {
  if (question == null) return ''
  const { options } = question

  switch (question.question_type) {
    case QuestionType.LINEAR_SCALE:
      if (options == null || options.length == 0)
        return 'No options [BAD]'
      
      return `${options[0].value} - ${options[options.length - 1].value}`
    default:
      return 'N/A'
  }
}