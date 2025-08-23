import React from 'react';
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
import DeleteIcon from '@mui/icons-material/Delete';
import { REACT_APP_API_URL } from '../../../config';
import { WatchStatus, WatchType } from '../../../enums/watch.enum';
import { T } from '../../../types/common';

type Watch = {
  _id: string;
  modelName: string;
  brand?: string;
  price?: number;
  watchOrigin?: string;
  watchType?: WatchType | string;
  watchStatus: WatchStatus;
  images?: string[];
  memberData?: { memberNick?: string };
};

const headCells = [
  { id: 'id',       label: 'MB ID' },
  { id: 'title',    label: 'MODEL' },
  { id: 'price',    label: 'PRICE' },
  { id: 'store',    label: 'STORE' },
  { id: 'origin',   label: 'ORIGIN' },
  { id: 'type',     label: 'TYPE' },
  { id: 'status',   label: 'STATUS' },
] as const;

function EnhancedTableHead() {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((c) => (
          <TableCell key={c.id} align="left">
            {c.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

interface WatchPanelListProps {
  watches: Watch[];
  updateWatchHandler: (input: { _id: string; watchStatus: WatchStatus }) => Promise<any> | void;
  removeWatchHandler: (watchId: string) => Promise<any> | void;
}

export const WatchPanelList = ({
  watches,
  updateWatchHandler,
  removeWatchHandler,
}: WatchPanelListProps) => {
  // local menu anchors keyed by watch id
  const [anchors, setAnchors] = React.useState<Record<string, HTMLElement | null>>({});

  const openMenu = (e: React.MouseEvent<HTMLElement>, key: string) =>
    setAnchors((p) => ({ ...p, [key]: e.currentTarget }));
  const closeMenu = (key?: string) =>
    setAnchors((p) => (key ? { ...p, [key]: null } : {}));

  // Ensure we’re mapping enum values as WatchStatus (not string)
  const watchStatusOptions = React.useMemo(
    () => Object.values(WatchStatus).filter((v): v is WatchStatus => typeof v === 'string'),
    []
  );

  return (
    <Stack>
      <TableContainer>
        <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
          <EnhancedTableHead />
          <TableBody>
            {(!watches || watches.length === 0) && (
              <TableRow>
                <TableCell align="center" colSpan={7}>
                  <span className="no-data">data not found!</span>
                </TableCell>
              </TableRow>
            )}

            {watches?.map((w) => {
              const img = w.images?.[0]
                ? `${REACT_APP_API_URL}/${w.images[0]}`
                : '/img/product/default.png';
              const statusKey = `${w._id}:status`;

              return (
                <TableRow hover key={w._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  {/* ID */}
                  <TableCell align="left">{w._id}</TableCell>

                  {/* Model (clickable when in stock) */}
                  <TableCell align="left" className="name">
                    {w.watchStatus === WatchStatus.IN_STOCK ? (
                      <Stack direction="row" alignItems="center">
                        <Link href={`/watch/detail?id=${w._id}`} /* adjust route to your detail page */>
                          <div>
                            <Avatar alt={w.modelName} src={img} sx={{ ml: '2px', mr: '10px' }} />
                          </div>
                        </Link>
                        <Link href={`/watch/detail?id=${w._id}`}>
                          <div>{w.modelName}</div>
                        </Link>
                      </Stack>
                    ) : (
                      <Stack direction="row" alignItems="center">
                        <div>
                          <Avatar alt={w.modelName} src={img} sx={{ ml: '2px', mr: '10px' }} />
                        </div>
                        <div style={{ marginTop: 10 }}>{w.modelName}</div>
                      </Stack>
                    )}
                  </TableCell>

                  {/* Price */}
                  <TableCell align="left">{w.price ?? '-'}</TableCell>

                  {/* Store / Member */}
                  <TableCell align="left">{w.memberData?.memberNick ?? '-'}</TableCell>

                  {/* Origin */}
                  <TableCell align="left">{w.watchOrigin ?? '-'}</TableCell>

                  {/* Type */}
                  <TableCell align="left">{w.watchType ?? '-'}</TableCell>

                  {/* Status / Actions */}
                  <TableCell align="left">
                    {w.watchStatus === WatchStatus.DELETE && (
                      <Button
                        variant="outlined"
                        sx={{ p: '3px', border: 'none', ':hover': { border: '1px solid #000000' } }}
                        onClick={() => removeWatchHandler(w._id)}
                        title="Permanently remove"
                      >
                        <DeleteIcon fontSize="small" />
                      </Button>
                    )}

                    {w.watchStatus === WatchStatus.SOLD && (
                      <Button className="badge warning">{w.watchStatus}</Button>
                    )}

                    {w.watchStatus === WatchStatus.OUT_OF_STOCK && (
                      <Button className="badge warning">{w.watchStatus}</Button>
                    )}

                    {w.watchStatus === WatchStatus.IN_STOCK && (
                      <>
                        <Button onClick={(e:T) => openMenu(e as any, statusKey)} className="badge success">
                          {w.watchStatus}
                        </Button>

                        <Menu
                          className="menu-modal"
                          MenuListProps={{ 'aria-labelledby': 'fade-button' }}
                          anchorEl={anchors[statusKey]}
                          open={Boolean(anchors[statusKey])}
                          onClose={() => closeMenu(statusKey)}
                          TransitionComponent={Fade}
                          sx={{ p: 1 }}
                        >
                          {watchStatusOptions
                            .filter((s) => s !== w.watchStatus)
                            .map((status) => (
                              <MenuItem
                                onClick={async () => {
                                  await updateWatchHandler({ _id: w._id, watchStatus: status }); // ✅ enum-safe
                                  closeMenu(statusKey);
                                }}
                                key={status}
                              >
                                <Typography variant="subtitle1" component="span">
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
