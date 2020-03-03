import { combineReducers } from 'redux'

import ActiveMatchingAlgorithms from './reducers/active-matching-algorithms'
import CancellationReasons from './reducers/cancellation-reasons'
import ClassSkills from './reducers/class-skills'
import ClassStudents from './reducers/class-students'
import Classes from './reducers/classes'
import Completions from './reducers/completions'
import CurrentUser from './reducers/current-user'
import Distributions from './reducers/distributions'
import FormQuestions from './reducers/form-questions'
import Forms from './reducers/forms'
import GlobalFlash from './reducers/global-flash'
import MatchingAlgorithms from './reducers/matching-algorithms'
import QuestionTypes from './reducers/question-types'
import Questions from './reducers/questions'
import Responses from './reducers/responses'
import SessionBeforeAfter from './reducers/session-before-after'
import Sessions from './reducers/sessions'
import Students from './reducers/students'
import UserCompletions from './reducers/user-completions'
import Users from './reducers/users'

const reducers = combineReducers({
  ActiveMatchingAlgorithms,
  CancellationReasons,
  ClassSkills,
  ClassStudents,
  Classes,
  Completions,
  CurrentUser,
  Distributions,
  FormQuestions,
  Forms,
  GlobalFlash,
  MatchingAlgorithms,
  QuestionTypes,
  Questions,
  Responses,
  SessionBeforeAfter,
  Sessions,
  Students,
  UserCompletions,
  Users,
})

export default reducers