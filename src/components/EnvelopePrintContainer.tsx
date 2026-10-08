import React from 'react';
import { KopData, PaperSizeConfig, Student, EnvelopeSettings } from '../types';
import { EnvelopeItem } from './EnvelopeItem';

interface EnvelopePrintContainerProps {
  students: Student[];
  singleStudent: Student | null;
  kop: KopData;
  settings: EnvelopeSettings;
  paper: PaperSizeConfig;
}

export const EnvelopePrintContainer: React.FC<EnvelopePrintContainerProps> = ({
  students,
  singleStudent,
  kop,
  settings,
  paper,
}) => {
  const studentsToPrint = singleStudent ? [singleStudent] : students;

  return (
    <div id="print-container" className="print-only">
      {studentsToPrint.map((student, index) => (
        <EnvelopeItem
          key={`print-${student.id}-${index}`}
          id={`envelope-print-item-${index}`}
          student={student}
          kop={kop}
          settings={settings}
          paper={paper}
          isPrintVersion={true}
        />
      ))}
    </div>
  );
};
