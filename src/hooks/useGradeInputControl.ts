import { gradeModuleInputControl } from '@/redux/reducers/inputControlReducer';
import { useAppSelector } from './redux';
import disabledPromptList from '@/utils/disabledPromptList';

const useGradeInputControl = () => {
  const inputControl = gradeModuleInputControl(
    useAppSelector((s) => s.inputControl)
  );
  const isInputDisabled = disabledPromptList.includes(inputControl);

  return { isInputDisabled, gradeInputControl: inputControl };
};

export default useGradeInputControl;
