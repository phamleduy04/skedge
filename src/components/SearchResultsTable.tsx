import KeyboardArrowIcon from '@mui/icons-material/KeyboardArrowRight';
import PersonIcon from '@mui/icons-material/Person';
import {
  Badge,
  Collapse,
  IconButton,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';

import Rating from '~components/Rating';
import SingleGradesInfo from '~components/SingleGradesInfo';
import SingleProfInfo from '~components/SingleProfInfo';
import TableSortLabel from '~components/TableSortLabel';
import type { RMPInterface } from '~data/fetchFromRmp';
import type { GenericFetchedData, GradesType } from '~pages';
import { useRainbowColors } from '~utils/colors';
import {
  convertToCourseOnly,
  convertToProfOnly,
  type SearchQuery,
  searchQueryLabel,
} from '~utils/SearchQuery';

type RowProps = {
  course: SearchQuery;
  grades: GenericFetchedData<GradesType>;
  backupGrades: GenericFetchedData<GradesType>;
  rmp: GenericFetchedData<RMPInterface>;
  setPage: (arg0: SearchQuery) => void;
};

function Row({ course, grades, backupGrades, rmp, setPage }: RowProps) {
  const [open, setOpen] = useState(false);
  const canOpen =
    !(typeof grades === 'undefined' || grades.state === 'error') ||
    !(typeof rmp === 'undefined' || rmp.state === 'error');

  const rainbowColors = useRainbowColors();
  const gpaToColor = (gpa: number): string => {
    if (gpa >= 4.0) return rainbowColors[1];
    if (gpa >= 3.67) return rainbowColors[2];
    if (gpa >= 3.33) return rainbowColors[3];
    if (gpa >= 3.0) return rainbowColors[4];
    if (gpa >= 2.67) return rainbowColors[5];
    if (gpa >= 2.33) return rainbowColors[6];
    if (gpa >= 2.0) return rainbowColors[7];
    if (gpa >= 1.67) return rainbowColors[8];
    if (gpa >= 1.33) return rainbowColors[9];
    if (gpa >= 1.0) return rainbowColors[10];
    if (gpa >= 0.67) return rainbowColors[11];
    return rainbowColors[12];
  };

  return (
    <>
      <TableRow>
        <TableCell className="border-b-0 pb-0" colSpan={6}>
          <Typography className="leading-tight text-lg text-gray-600 dark:text-gray-200">
            {searchQueryLabel(convertToProfOnly(course))}
          </Typography>
        </TableCell>
      </TableRow>
      <TableRow
        onClick={() => {
          if (canOpen) {
            setOpen(!open);
          }
        }} // opens/closes the card by clicking anywhere on the row
      >
        <TableCell className="border-b-0 pr-0">
          <Tooltip
            title={open ? 'Minimize Result' : 'Expand Result'}
            placement="top"
          >
            <IconButton
              aria-label="expand row"
              className={'transition-transform' + (open ? ' rotate-90' : '')}
              disabled={!canOpen}
            >
              <KeyboardArrowIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
        <TableCell
          className="border-b-0"
          onClick={
            (e) => e.stopPropagation() // prevents opening/closing the card when clicking on the compare checkbox
          }
        >
          <Tooltip title="Open professor profile" placement="top">
            <IconButton
              aria-label="open professor profile"
              onClick={() => setPage(convertToProfOnly(course))}
            >
              <PersonIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
        <TableCell align="right" className="border-b-0">
          {((typeof grades === 'undefined' || grades.state === 'error') &&
            (((typeof backupGrades === 'undefined' ||
              backupGrades.state === 'error') && <></>) ||
              (backupGrades.state === 'loading' && (
                <Skeleton
                  variant="rounded"
                  className="rounded-full px-5 py-2 ml-auto"
                >
                  <Typography className="text-base">A</Typography>
                </Skeleton>
              )) ||
              (backupGrades.state === 'done' && (
                <Tooltip
                  title={'GPA: ' + backupGrades.data.gpa.toFixed(2)}
                  placement="top"
                >
                  <Badge
                    color="primary"
                    sx={{
                      '& .MuiBadge-badge': {
                        padding: 0,
                      },
                    }}
                    badgeContent={
                      <Tooltip
                        title={
                          'Grade from professor overall, not just ' +
                          searchQueryLabel(convertToCourseOnly(course))
                        }
                      >
                        <div className="w-full h-full flex justify-center items-center">
                          *
                        </div>
                      </Tooltip>
                    }
                  >
                    <Typography
                      className="text-base text-black rounded-full px-5 py-2 inline"
                      sx={{
                        backgroundColor: gpaToColor(backupGrades.data.gpa),
                      }}
                    >
                      {backupGrades.data.letter_grade}
                    </Typography>
                  </Badge>
                </Tooltip>
              )))) ||
            (grades.state === 'loading' && (
              <Skeleton
                variant="rounded"
                className="rounded-full px-5 py-2 ml-auto"
              >
                <Typography className="text-base">A</Typography>
              </Skeleton>
            )) ||
            (grades.state === 'done' && (
              <Tooltip
                title={'GPA: ' + grades.data.gpa.toFixed(2)}
                placement="top"
              >
                <Typography
                  className="text-base text-black rounded-full px-5 py-2 inline"
                  sx={{ backgroundColor: gpaToColor(grades.data.gpa) }}
                >
                  {grades.data.letter_grade}
                </Typography>
              </Tooltip>
            )) ||
            null}
        </TableCell>
        <TableCell align="right" className="border-b-0">
          {((typeof rmp === 'undefined' || rmp.state === 'error') && <></>) ||
            (rmp.state === 'loading' && (
              <Skeleton variant="rounded" className="rounded-full ml-auto">
                <Rating sx={{ fontSize: 25 }} readOnly />
              </Skeleton>
            )) ||
            (rmp.state === 'done' && (
              <Tooltip
                title={'Professor rating: ' + rmp.data.avgRating}
                placement="top"
              >
                <div>
                  <Rating
                    defaultValue={rmp.data.avgRating}
                    precision={0.1}
                    sx={{ fontSize: 25 }}
                    readOnly
                  />
                </div>
              </Tooltip>
            )) ||
            null}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell className="p-0" colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <div className="p-2 md:p-4 flex flex-col gap-2">
              <SingleGradesInfo course={course} grades={grades} />
              <SingleProfInfo rmp={rmp} />
            </div>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

type SearchResultsTableProps = {
  results: SearchQuery[];
  grades: { [key: string]: GenericFetchedData<GradesType> };
  rmp: { [key: string]: GenericFetchedData<RMPInterface> };
  setPage: (arg0: SearchQuery) => void;
};

const SearchResultsTable = ({
  results,
  grades,
  rmp,
  setPage,
}: SearchResultsTableProps) => {
  //Table sorting category
  const [orderBy, setOrderBy] = useState<'none' | 'gpa' | 'rating'>('none');
  //Table sorting direction
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  //Cycle through sorting
  function handleClick(col: 'none' | 'gpa' | 'rating') {
    if (orderBy !== col) {
      setOrderBy(col);
      setOrder('desc'); //default number behavior goes from high to low for our metrics
    } else {
      if (order === 'desc') {
        setOrder('asc');
      } else {
        setOrderBy('none');
      }
    }
  }

  //Sort
  let sortedResults = results;
  if (orderBy !== 'none') {
    sortedResults = [...results].sort((a, b) => {
      if (orderBy === 'gpa') {
        let aGrades = grades[searchQueryLabel(a)];
        let bGrades = grades[searchQueryLabel(b)];
        if (!aGrades || aGrades.state !== 'done') {
          aGrades = grades[searchQueryLabel(convertToProfOnly(a))];
        }
        if (!bGrades || bGrades.state !== 'done') {
          bGrades = grades[searchQueryLabel(convertToProfOnly(b))];
        }

        if (
          (!aGrades || aGrades.state !== 'done') &&
          (!bGrades || bGrades.state !== 'done')
        ) {
          return 0;
        }

        if (!aGrades || aGrades.state !== 'done') {
          return 9999;
        }
        if (!bGrades || bGrades.state !== 'done') {
          return -9999;
        }

        if (order === 'asc') {
          return aGrades.data.gpa - bGrades.data.gpa;
        }
        return bGrades.data.gpa - aGrades.data.gpa;
      }
      if (orderBy === 'rating') {
        const aRmp = rmp[searchQueryLabel(convertToProfOnly(a))];
        const bRmp = rmp[searchQueryLabel(convertToProfOnly(b))];
        //drop loading/error rows to bottom
        if (
          (!aRmp || aRmp.state !== 'done') &&
          (!bRmp || bRmp.state !== 'done')
        ) {
          // If both aRmp and bRmp are not done, treat them as equal and return 0
          return 0;
        }
        if (!aRmp || aRmp.state !== 'done') {
          return 9999;
        }
        if (!bRmp || bRmp.state !== 'done') {
          return -9999;
        }
        const aRating = aRmp?.data?.avgRating ?? 0; // Fallback to 0 if undefined
        const bRating = bRmp?.data?.avgRating ?? 0; // Fallback to 0 if undefined
        if (order === 'asc') {
          return aRating - bRating;
        }
        return bRating - aRating;
      }
      return 0;
    });
  }

  return (
    //TODO: sticky header
    <TableContainer component={Paper}>
      <Table stickyHeader aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Profile</TableCell>
            <TableCell>
              <Tooltip
                title="Average GPA Across Course Sections"
                placement="top"
              >
                <div>
                  <TableSortLabel
                    active={orderBy === 'gpa'}
                    direction={orderBy === 'gpa' ? order : 'desc'}
                    onClick={() => {
                      handleClick('gpa');
                    }}
                  >
                    Grades
                  </TableSortLabel>
                </div>
              </Tooltip>
            </TableCell>
            <TableCell>
              <Tooltip
                title="Average Professor Rating from Rate My Professors"
                placement="top"
              >
                <div>
                  <TableSortLabel
                    active={orderBy === 'rating'}
                    direction={orderBy === 'rating' ? order : 'desc'}
                    onClick={() => {
                      handleClick('rating');
                    }}
                  >
                    Rating
                  </TableSortLabel>
                </div>
              </Tooltip>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedResults.map((result) => (
            <Row
              key={searchQueryLabel(result)}
              course={result}
              grades={grades[searchQueryLabel(result)]}
              backupGrades={grades[searchQueryLabel(convertToProfOnly(result))]}
              rmp={rmp[searchQueryLabel(convertToProfOnly(result))]}
              setPage={setPage}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SearchResultsTable;
