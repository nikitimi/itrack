'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { authenticationStatus } from '@/redux/reducers/authenticationReducer';
import {
  internshipCompanyQuestion,
  internshipCompanyQuestionUpdate,
} from '@/redux/reducers/internshipReducer';
import disabledNoUserList from '@/utils/authentication/disabledNoUserList';

const InternshipIsITCompany = () => {
  const dispatch = useAppDispatch();
  const yesOrNo = ['yes', 'no'] as const;
  const authStatus = authenticationStatus(
    useAppSelector((s) => s.authentication)
  );
  const companyQuestion = internshipCompanyQuestion(
    useAppSelector((s) => s.internship)
  );

  function setIsITState(yesNo: (typeof yesOrNo)[number]) {
    dispatch(internshipCompanyQuestionUpdate(yesNo === 'yes'));
  }

  function handleYesOrNo(
    event: React.MouseEvent<HTMLButtonElement>,
    yesNo: 'yes' | 'no'
  ) {
    const isYes = yesNo === 'yes';
    const color = isYes ? 'bg-green-400' : 'bg-red-400';
    const parent = event.currentTarget.parentNode;
    if (parent === null) return;
    ([...parent.childNodes] as HTMLButtonElement[]).forEach((button) => {
      button.classList.remove(...['bg-green-400', 'bg-red-400']);
    });

    setIsITState(yesNo);
    event.currentTarget.classList.add(color);
  }

  return (
    <Card className="rounded-none border-none bg-transparent shadow-none">
      <CardHeader>
        <CardTitle>Internship Form</CardTitle>
        <CardDescription>
          Did you complete your internship at an IT company?
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-flow-col gap-2 p-2">
        {yesOrNo.map((yesNo) => (
          <Button
            key={yesNo}
            type="button"
            className={`${companyQuestion === 'initializing' ? 'bg-black' : companyQuestion && yesNo === 'yes' ? 'bg-green-400' : !companyQuestion && yesNo === 'no' ? 'bg-red-400' : ''} capitalize`}
            disabled={disabledNoUserList.includes(authStatus)}
            onClick={(e) => handleYesOrNo(e, yesNo)}
          >
            {yesNo}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};

export default InternshipIsITCompany;
