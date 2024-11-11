'use client';

import useRevealAllModulesResult from '@/hooks/useRevealAllModulesResult';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SidebarMenuSkeleton } from '@/components/ui/sidebar';
import useCertificateInputControl from '@/hooks/useCertificateInputControl';
import useInternshipInputControl from '@/hooks/useInternshipInputControl';
import useGradeInputControl from '@/hooks/useGradeInputControl';
import { PromptType } from '@/lib/enums/promptType';
import constantNameFormatter from '@/utils/constantNameFormatter';
import { Button } from '@/components/ui/button';
import { authenticationStatus } from '@/redux/reducers/authenticationReducer';
import { useAppSelector } from '@/hooks/redux';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import GradeChart from '@/components/charts/GradeChart';
import { ChartConfig } from '@/components/ui/chart';
import disabledNoUserList from '@/utils/authentication/disabledNoUserList';

// TODO: Only show if the modules are completed.
const ModuleResults = () => {
  const { certificateInputControl } = useCertificateInputControl();
  const { gradeInputControl } = useGradeInputControl();
  const { internshipInputControl } = useInternshipInputControl();
  const { certificate, grades, internship, jobHolder } =
    useRevealAllModulesResult();
  const authStatus = authenticationStatus(
    useAppSelector((s) => s.authentication)
  );
  const conditionList = ['fetched from server', 'submitted'] as PromptType[];
  const results = [
    {
      title: 'certificate',
      conditionToRender: conditionList.includes(certificateInputControl),
      objectArray: certificate,
    },
    {
      title: 'academic grades',
      conditionToRender: conditionList.includes(gradeInputControl),
      objectArray: grades ?? [],
    },
    {
      title: 'internship',
      conditionToRender: conditionList.includes(internshipInputControl),
      objectArray: internship,
    },
  ];

  const overall = {
    title: 'overall result',
    conditionToRender:
      conditionList.includes(certificateInputControl) &&
      conditionList.includes(gradeInputControl) &&
      conditionList.includes(internshipInputControl),
    objectArray: Object.entries(jobHolder).splice(0, 3),
  };
  const titles = results.flatMap(({ title }) => title);

  switch (authStatus) {
    case 'initializing':
      return (
        <div className="grid grid-flow-col gap-4">
          {titles.map((title) => (
            <RenderTable
              isLoading
              key={title}
              title={title}
              conditionToRender={true}
              objectArray={[]}
            />
          ))}
        </div>
      );
    case 'no user':
    case 'verifying account':
    case 'verifying new password':
      return <></>;
    case 'authenticated':
      return (
        <section className="flex flex-col gap-4 p-4">
          <div className="grid grid-flow-row gap-4 md:grid-flow-col">
            {results.map((props) => {
              return <RenderTable key={props.title} {...props} />;
            })}
          </div>
          <RenderTable {...overall} />
        </section>
      );
  }
};

const RenderTable = (props: {
  title: string;
  conditionToRender: boolean;
  objectArray: Array<[string, number]>;
  isLoading?: boolean;
}) => {
  const authStatus = authenticationStatus(
    useAppSelector((s) => s.authentication)
  );
  const heading = {
    one: 'careers',
    two: 'ranks',
  };

  const chartConfig = {
    career: {
      label: 'Career',
      color: 'hsl(var(--chart-4))',
    },
    percentage: {
      label: 'Percentage(%)',
      color: 'hsl(var(--chart-5))',
    },
  } satisfies ChartConfig;

  const totalPoints = props.objectArray
    .flatMap(([, p]) => p)
    .reduce((a, b) => a + b);
  const chartData = props.objectArray.map(([career, points]) => ({
    career: constantNameFormatter(career, true),
    percentage: ((Math.ceil(points) / Math.ceil(totalPoints)) * 100).toFixed(2),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="capitalize">{`${props.title}:`}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          {props.isLoading ? (
            <TableRow>
              {Array.from({ length: 6 }).map((_, index) => (
                <SidebarMenuSkeleton key={index} showIcon />
              ))}
            </TableRow>
          ) : (
            <>
              <TableHeader className="capitalize">
                <TableRow>
                  <TableHead>
                    <p>{heading.one}</p>
                  </TableHead>
                  <TableHead>
                    <p>{heading.two}</p>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {props.conditionToRender ? (
                  props.objectArray.map(([key], index) => {
                    return (
                      <TableRow key={key}>
                        <TableCell className="capitalize">
                          {constantNameFormatter(key)}
                        </TableCell>
                        {/* <p>{number}</p> */} {/* Value of result */}
                        <TableCell>{index + 1}</TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  // No results yet.
                  <TableRow />
                )}
              </TableBody>
            </>
          )}
        </Table>
      </CardContent>
      <CardFooter>
        <Dialog>
          <DialogHeader className="mx-auto w-64">
            <DialogTrigger disabled={disabledNoUserList.includes(authStatus)}>
              <Button disabled={true}>
                <DialogTitle className="font-geist-mono font-normal">
                  Show Breakdown
                </DialogTitle>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <GradeChart
                selectStyle="mt-2"
                title={`${props.title} breakdown`}
                chartData={chartData}
                chartConfig={chartConfig}
              />
            </DialogContent>
          </DialogHeader>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default ModuleResults;
