'use client';

import { useEffect, useState } from 'react';

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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// TODO: Only show if the modules are completed.
const ModuleResults = () => {
  const { certificateInputControl } = useCertificateInputControl();
  const { gradeInputControl } = useGradeInputControl();
  const { internshipInputControl } = useInternshipInputControl();
  const { certificate, grades, internship, jobHolder } =
    useRevealAllModulesResult();
  const conditionList = ['fetched from server', 'submitted'] as PromptType[];
  const [state, setState] = useState(false);
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

  useEffect(() => setState(true), []);

  if (!state)
    return (
      <>
        {titles.map((title) => (
          <RenderTable
            isLoading
            key={title}
            title={title}
            conditionToRender={true}
            objectArray={[]}
          />
        ))}
      </>
    );

  return (
    <section className="flex flex-col gap-4 p-4">
      <div className="grid grid-flow-col gap-4">
        {results.map((props) => {
          return <RenderTable key={props.title} {...props} />;
        })}
      </div>
      <RenderTable {...overall} />
    </section>
  );
};

const RenderTable = (props: {
  title: string;
  conditionToRender: boolean;
  objectArray: Array<[string, number]>;
  isLoading?: boolean;
}) => {
  const heading = {
    one: 'careers',
    two: 'ranks',
  };

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
                        {/* <p>{number}</p> */}
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
        <Tooltip>
          <TooltipTrigger className="w-full">
            <Button disabled={true} className="w-full">
              Show Breakdown
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Not yet implemented.</p>
          </TooltipContent>
        </Tooltip>
      </CardFooter>
    </Card>
  );
};

export default ModuleResults;
