import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  TableCell,
  TableHead,
  TableBody,
  TableRow,
  Table,
  TableContainer,
  Button,
  Menu,
  Fade,
  MenuItem,
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/material';
import { Member } from '../../../types/member/member';
import { NEXT_APP_API_URL } from '../../../config';
import { MemberStatus, MemberType } from '../../../enums/member.enum';
import { T } from '../../../types/common';

/** Table head config */
interface Data {
  id: string;
  nickname: string;
  fullname: string;
  phone: string;
  type: string;
  state: string;
  warning: string;
  block: string;
}
type Order = 'asc' | 'desc';

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  { id: 'id',       numeric: false, disablePadding: false, label: 'MB ID' },
  { id: 'nickname', numeric: false, disablePadding: false, label: 'NICK NAME' },
  { id: 'fullname', numeric: false, disablePadding: false, label: 'FULL NAME' },
  { id: 'phone',    numeric: false, disablePadding: false, label: 'PHONE NUM' },
  { id: 'type',     numeric: false, disablePadding: false, label: 'MEMBER TYPE' },
  { id: 'warning',  numeric: false, disablePadding: false, label: 'WARNING' },
  { id: 'block',    numeric: false, disablePadding: false, label: 'BLOCK CRIMES' },
  { id: 'state',    numeric: false, disablePadding: false, label: 'STATE' },
];

function EnhancedTableHead() {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

/** Props */
interface MemberPanelListType {
  members: Member[];
  /** Optional external menu controls (kept for backward-compat) */
  anchorEl?: Record<string, HTMLElement | null>;
  menuIconClickHandler?: (e: React.MouseEvent<HTMLElement>, key: string) => void;
  menuIconCloseHandler?: (key?: string) => void;
  /** Required */
  updateMemberHandler: (input: Partial<Member> & { _id: string }) => Promise<any> | void;
}

export const MemberPanelList = (props: MemberPanelListType) => {
  const {
    members,
    anchorEl,
    menuIconClickHandler,
    menuIconCloseHandler,
    updateMemberHandler,
  } = props;

  /** Local fallback anchors if parent doesn't provide them */
  const [localAnchors, setLocalAnchors] = useState<Record<string, HTMLElement | null>>({});

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

  return (
    <Stack>
      <TableContainer>
        <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
          <EnhancedTableHead />
          <TableBody>
            {(!members || members.length === 0) && (
              <TableRow>
                <TableCell align="center" colSpan={8}>
                  <span className={'no-data'}>data not found!</span>
                </TableCell>
              </TableRow>
            )}

            {members && members.length > 0 && members.map((member: Member) => {
              const member_image = member.memberImage
                ? `${NEXT_APP_API_URL}/${member.memberImage}`
                : '/img/profile/defaultUser.svg';

              // Stable, clear keys for menus
              const typeKey = `${member._id}:type`;
              const statusKey = `${member._id}:status`;

              return (
                <TableRow hover key={member?._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell align="left">{member._id}</TableCell>

                  <TableCell align="left" className={'name'}>
                    <Stack direction={'row'} alignItems="center">
                      <Link href={`/member?memberId=${member._id}`}>
                        <div>
                          <Avatar alt={member.memberNick} src={member_image} sx={{ ml: '2px', mr: '10px' }} />
                        </div>
                      </Link>
                      <Link href={`/member?memberId=${member._id}`}>
                        <div>{member.memberNick}</div>
                      </Link>
                    </Stack>
                  </TableCell>

                  <TableCell align="left">{member.memberFullName ?? '-'}</TableCell>
                  <TableCell align="left">{member.memberPhone ?? '-'}</TableCell>

                  {/* Member Type */}
                  <TableCell align="left">
                    <Button onClick={(e:T) => openMenu(e as any, typeKey)} className={'badge success'}>
                      {member.memberType}
                    </Button>

                    <Menu
                      className={'menu-modal'}
                      MenuListProps={{ 'aria-labelledby': 'fade-button' }}
                      anchorEl={anchors?.[typeKey] ?? null}
                      open={Boolean(anchors?.[typeKey])}
                      onClose={() => closeMenu(typeKey)}
                      TransitionComponent={Fade}
                      sx={{ p: 1 }}
                    >
                      {Object.values(MemberType)
                        .filter((t) => t !== member.memberType)
						.map((type) => (
						  <MenuItem
							onClick={async () => {
							  await updateMemberHandler({ _id: member._id, memberType: type }); 
							  closeMenu(typeKey);
							}}
							key={type}
						  >
							<Typography variant="subtitle1" component="span">{type}</Typography>
						  </MenuItem>
					  ))}
					  
                    </Menu>
                  </TableCell>

                  <TableCell align="left">{member.memberWarnings ?? 0}</TableCell>
                  <TableCell align="left">{member.memberBlocks ?? 0}</TableCell>

                  {/* Member Status */}
                  <TableCell align="left">
                    <Button onClick={(e:T) => openMenu(e as any, statusKey)} className={'badge success'}>
                      {member.memberStatus}
                    </Button>

                    <Menu
                      className={'menu-modal'}
                      MenuListProps={{ 'aria-labelledby': 'fade-button' }}
                      anchorEl={anchors?.[statusKey] ?? null}
                      open={Boolean(anchors?.[statusKey])}
                      onClose={() => closeMenu(statusKey)}
                      TransitionComponent={Fade}
                      sx={{ p: 1 }}
                    >
                      {Object.values(MemberStatus)
                        .filter((s) => s !== member.memberStatus)
						.map((status) => (
						  <MenuItem
							onClick={async () => {
							  await updateMemberHandler({ _id: member._id, memberStatus: status }); 
							  closeMenu(statusKey);
							}}
							key={status}
						  >
							<Typography variant="subtitle1" component="span">{status}</Typography>
						  </MenuItem>
					  ))}
                    </Menu>
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
