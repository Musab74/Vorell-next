import React from 'react';
import Link from 'next/link';
import {
  Box,
  Button,
  Fade,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import OpenInBrowserRoundedIcon from '@mui/icons-material/OpenInBrowserRounded';
import Moment from 'react-moment';
import { BoardArticle } from '../../../types/board-article/board-article';
import { NEXT_APP_API_URL } from '../../../config';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';
import { BoardArticleStatus } from '../../../enums/board-article.enum';

interface Data {
  category: string;
  title: string;
  writer: string;
  register: string;
  view: number;
  like: number;
  status: string;
  article_id: string;
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  { id: 'article_id', numeric: true,  disablePadding: false, label: 'ARTICLE ID' },
  { id: 'title',      numeric: true,  disablePadding: false, label: 'TITLE' },
  { id: 'category',   numeric: true,  disablePadding: false, label: 'CATEGORY' },
  { id: 'writer',     numeric: true,  disablePadding: false, label: 'WRITER' },
  { id: 'view',       numeric: false, disablePadding: false, label: 'VIEW' },
  { id: 'like',       numeric: false, disablePadding: false, label: 'LIKE' },
  { id: 'register',   numeric: true,  disablePadding: false, label: 'REGISTER DATE' },
  { id: 'status',     numeric: false, disablePadding: false, label: 'STATUS' },
];

function EnhancedTableHead() {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'left' : 'center'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

interface CommunityArticleListProps {
  articles: BoardArticle[];
  // optional external menu control (kept for backward-compat)
  anchorEl?: Record<string, HTMLElement | null>;
  menuIconClickHandler?: (e: React.MouseEvent<HTMLElement>, key: string) => void;
  menuIconCloseHandler?: (key?: string) => void;

  updateArticleHandler: (input: { _id: string; articleStatus: BoardArticleStatus }) => Promise<any> | void;
  removeArticleHandler: (id: string) => Promise<any> | void;
}

const CommunityArticleList = (props: CommunityArticleListProps) => {
  const {
    articles,
    anchorEl,
    menuIconClickHandler,
    menuIconCloseHandler,
    updateArticleHandler,
    removeArticleHandler,
  } = props;

  // local fallback anchors if parent not provided
  const [localAnchors, setLocalAnchors] = React.useState<Record<string, HTMLElement | null>>({});
  const anchors = anchorEl ?? localAnchors;

  const openMenu = (e: React.MouseEvent<HTMLElement>, key: string) => {
    if (menuIconClickHandler) return menuIconClickHandler(e, key);
    setLocalAnchors((prev) => ({ ...prev, [key]: e.currentTarget }));
  };

  const closeMenu = (key?: string) => {
    if (menuIconCloseHandler) return menuIconCloseHandler(key);
    if (!key) return setLocalAnchors({});
    setLocalAnchors((prev) => ({ ...prev, [key]: null }));
  };

  // enum-safe status options
  const statusOptions = React.useMemo(
    () => Object.values(BoardArticleStatus).filter((v): v is BoardArticleStatus => typeof v === 'string'),
    []
  );

  return (
    <Stack>
      <TableContainer>
        <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
          <EnhancedTableHead />
          <TableBody>
            {articles.length === 0 && (
              <TableRow>
                <TableCell align="center" colSpan={8}>
                  <span className={'no-data'}>data not found!</span>
                </TableCell>
              </TableRow>
            )}

            {articles.length !== 0 &&
              articles.map((article: BoardArticle) => {
                const statusKey = `${article._id}:status`;

                return (
                  <TableRow hover key={article._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell align="left">{article._id}</TableCell>

                    <TableCell align="left">
                      <Box component="div">
                        {article.articleTitle}
                        {article.articleStatus === BoardArticleStatus.ACTIVE && (
                          <Link
                            href={`/community/detail?articleCategory=${article.articleCategory}&id=${article._id}`}
                            className={'img_box'}
                          >
                            <IconButton className="btn_window">
                              <Tooltip title={'Open window'}>
                                <OpenInBrowserRoundedIcon />
                              </Tooltip>
                            </IconButton>
                          </Link>
                        )}
                      </Box>
                    </TableCell>

                    <TableCell align="left">{article.articleCategory}</TableCell>

                    <TableCell align="left" className={'name'}>
                      <Link href={`/member?memberId=${article?.memberData?._id}`}>
                        <Avatar
                          alt={article?.memberData?.memberNick || 'author'}
                          src={
                            article?.memberData?.memberImage
                              ? `${NEXT_APP_API_URL}/${article?.memberData?.memberImage}`
                              : `/img/profile/defaultUser.svg`
                          }
                          sx={{ ml: '2px', mr: '10px' }}
                        />
                        {article?.memberData?.memberNick}
                      </Link>
                    </TableCell>

                    <TableCell align="center">{article?.articleViews}</TableCell>
                    <TableCell align="center">{article?.articleLikes}</TableCell>

                    <TableCell align="left">
                      <Moment format={'DD.MM.YY HH:mm'}>{article?.createdAt}</Moment>
                    </TableCell>

                    <TableCell align="center">
                      {article.articleStatus === BoardArticleStatus.DELETE ? (
                        <Button
                          variant="outlined"
                          sx={{ p: '3px', border: 'none', ':hover': { border: '1px solid #000000' } }}
                          onClick={() => removeArticleHandler(article._id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </Button>
                      ) : (
                        <>
                          <Button onClick={(e:any) => openMenu(e as any, statusKey)} className={'badge success'}>
                            {article.articleStatus}
                          </Button>

                          <Menu
                            className={'menu-modal'}
                            MenuListProps={{ 'aria-labelledby': 'fade-button' }}
                            anchorEl={anchors[statusKey] ?? null}
                            open={Boolean(anchors[statusKey])}
                            onClose={() => closeMenu(statusKey)}
                            TransitionComponent={Fade}
                            sx={{ p: 1 }}
                          >
                            {statusOptions
                              .filter((s) => s !== article.articleStatus)
                              .map((status) => (
                                <MenuItem
                                  onClick={async () => {
                                    await updateArticleHandler({ _id: article._id, articleStatus: status }); // ✅ enum-safe
                                    closeMenu(statusKey);
                                  }}
                                  key={status}
                                >
                                  <Typography variant={'subtitle1'} component={'span'}>
                                    {status}
                                  </Typography>
                                </MenuItem>
                              ))}
                          </Menu>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};

export default CommunityArticleList;
