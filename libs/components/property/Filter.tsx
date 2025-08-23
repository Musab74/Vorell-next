import React, { useState, useCallback } from 'react';
import {
  Stack,
  Typography,
  Checkbox,
  FormControlLabel,
  Switch,
  Collapse,
} from '@mui/material';
import { useRouter } from 'next/router';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

import { WatchesInquiry, WatchSearch } from '../../types/watch/watch.input';
import {
  CaseDiameter,
  Movement,
  WatchBrand,
  WatchOrigin,
  WatchType,
} from '../../enums/watch.enum';
import useDeviceDetect from '../../hooks/useDeviceDetect';

interface FilterType {
  searchFilter: WatchesInquiry;
  setSearchFilter: (val: WatchesInquiry) => void;
  initialInput: WatchesInquiry;
}

/** Keys in WatchSearch that are arrays used by the filter’s generic handler */
type MultiArrayKeys =
  | 'brandList'
  | 'movement'
  | 'originList'
  | 'typeList'
  | 'caseDiameter';

const Filter: React.FC<FilterType> = ({ searchFilter, setSearchFilter }) => {
  const device = useDeviceDetect();
  const router = useRouter();

  const [open, setOpen] = useState({
    brand: true,
    movement: false,
    case: false,
    craft: false,
  });

  /**
   * IMPORTANT: Use string literals for caseDiameter values.
   * This avoids numeric-enum reverse mapping issues where the enum value is a number.
   */
  const caseDiameterList: { value: string; label: string }[] = [
    { value: 'MM36', label: '36mm' },
    { value: 'MM38', label: '38mm' },
    { value: 'MM40', label: '40mm' },
    { value: 'MM42', label: '42mm' },
    { value: 'MM44', label: '44mm' },
    { value: 'OTH',  label: 'Other' },
  ];

  /** Generic handler for array fields in WatchSearch */
  const handleArrayCheckbox = useCallback(
    async (
      e: React.ChangeEvent<HTMLInputElement>,
      field: MultiArrayKeys
    ) => {
      const rawValue = e.target.value;        // always a string from <input>
      const value = String(rawValue);         // normalize to string
      const checked = e.target.checked;

      // Ensure we always work with a string[] in state
      const prev: string[] = Array.isArray(searchFilter?.search?.[field])
        ? (searchFilter.search![field] as string[])
        : [];

      const nextArray = checked
        ? Array.from(new Set([...prev, value])) // de-dupe just in case
        : prev.filter((item) => item !== value);

      const nextSearch: WatchSearch = {
        ...(searchFilter.search ?? {}),
        [field]: nextArray.length ? nextArray : undefined,
      };

      setSearchFilter({ ...searchFilter, search: nextSearch });

      await router.push(
        `/watches?input=${encodeURIComponent(JSON.stringify({
          ...searchFilter,
          search: nextSearch,
        }))}`,
        undefined,
        { scroll: false }
      );
    },
    [searchFilter, setSearchFilter, router]
  );

  /** Limited Edition switch */
  const handleLimitedEdition = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const nextSearch: WatchSearch = {
        ...(searchFilter.search ?? {}),
        isLimitedEdition: e.target.checked || undefined,
      };

      setSearchFilter({ ...searchFilter, search: nextSearch });

      await router.push(
        `/watches?input=${encodeURIComponent(JSON.stringify({
          ...searchFilter,
          search: nextSearch,
        }))}`,
        undefined,
        { scroll: false }
      );
    },
    [searchFilter, setSearchFilter, router]
  );

  if (device === 'mobile') return <div>WATCHES FILTER</div>;

  const sectionTitleStyle = {
    fontWeight: 600,
    fontSize: 15,
    color: '#b4a68a',
    fontFamily: "'Judson', serif",
    letterSpacing: '1.3px',
  };

  const checkboxStyle = {
    color: '#b69c70',
    '&.Mui-checked': { color: '#c6a872' },
  };

  return (
    <Stack className="filter-main">
      {/* --- Brand / Collections --- */}
      <FilterSection
        title="Collections"
        open={open.brand}
        toggle={() => setOpen((p) => ({ ...p, brand: !p.brand }))}
        items={Object.values(WatchBrand)}
        checkedFn={(val) => !!searchFilter?.search?.brandList?.includes(val)}
        onChange={(e) => handleArrayCheckbox(e, 'brandList')}
        sectionTitleStyle={sectionTitleStyle}
        checkboxStyle={checkboxStyle}
      />

      {/* --- Movement --- */}
      <FilterSection
        title="Movement"
        open={open.movement}
        toggle={() => setOpen((p) => ({ ...p, movement: !p.movement }))}
        items={Object.values(Movement)}
        checkedFn={(val) => !!searchFilter?.search?.movement?.includes(val as Movement)}
        onChange={(e) => handleArrayCheckbox(e, 'movement')}
        sectionTitleStyle={sectionTitleStyle}
        checkboxStyle={checkboxStyle}
      />

      {/* --- Case Diameter & Style --- */}
      <Stack className="brand-section" sx={{ mb: 3 }}>
        <Stack
          direction="row"
          alignItems="center"
          onClick={() => setOpen((p) => ({ ...p, case: !p.case }))}
          style={{ cursor: 'pointer' }}
        >
          <Typography className="title" sx={sectionTitleStyle}>
            Case / Style
          </Typography>
          {open.case ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </Stack>

        <Collapse in={open.case}>
          {/* Case Diameter */}
          <Typography
            sx={{ mt: 1, mb: 1, fontWeight: 500, fontSize: 14, color: '#ad9978' }}
          >
            Case Diameter
          </Typography>
          <div className="brand-grid">
            {caseDiameterList.map(({ value, label }) => (
              <div className="brand-item" key={value}>
                <Checkbox
                  className="watch-checkbox"
                  checked={!!searchFilter?.search?.caseDiameter?.includes(String(value))}
                  onChange={(e) => handleArrayCheckbox(e, 'caseDiameter')}
                  value={String(value)}          // force string
                  sx={checkboxStyle}
                />
                <span className="watch-type" style={{ fontSize: 14 }}>
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Style */}
          <Typography
            sx={{ mt: 2, mb: 1, fontWeight: 500, fontSize: 14, color: '#ad9978' }}
          >
            Style
          </Typography>
          <div className="brand-grid">
            {Object.values(WatchType).map((type) => (
              <div className="brand-item" key={type}>
                <Checkbox
                  className="watch-checkbox"
                  checked={!!searchFilter?.search?.typeList?.includes(type)}
                  onChange={(e) => handleArrayCheckbox(e, 'typeList')}
                  value={type}
                  sx={checkboxStyle}
                />
                <span className="watch-type" style={{ fontSize: 14 }}>
                  {type}
                </span>
              </div>
            ))}
          </div>
        </Collapse>
      </Stack>

      {/* --- Origin --- */}
      <FilterSection
        title="Origins"
        open={open.craft}
        toggle={() => setOpen((p) => ({ ...p, craft: !p.craft }))}
        items={Object.values(WatchOrigin)}
        checkedFn={(val) => !!searchFilter?.search?.originList?.includes(val as WatchOrigin)}
        onChange={(e) => handleArrayCheckbox(e, 'originList')}
        sectionTitleStyle={sectionTitleStyle}
        checkboxStyle={checkboxStyle}
      />

      {/* --- Limited Edition --- */}
      <Stack className="find-your-watch" mt={2}>
        <FormControlLabel
          control={
            <Switch
              checked={!!searchFilter?.search?.isLimitedEdition}
              onChange={handleLimitedEdition}
              color="primary"
              sx={{
                '& .MuiSwitch-thumb': { backgroundColor: '#b69c70' },
                '& .MuiSwitch-track': { backgroundColor: '#f0e3ce' },
              }}
            />
          }
          label={
            <span
              style={{
                color: '#626262',
                fontFamily: "'Judson', serif",
                fontSize: 15,
              }}
            >
              Limited Edition Only
            </span>
          }
        />
      </Stack>
    </Stack>
  );
};

export default Filter;

// Reusable section component
const FilterSection = ({
  title,
  open,
  toggle,
  items,
  checkedFn,
  onChange,
  sectionTitleStyle,
  checkboxStyle,
}: {
  title: string;
  open: boolean;
  toggle: () => void;
  items: string[];
  checkedFn: (val: string) => boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  sectionTitleStyle: any;
  checkboxStyle: any;
}) => (
  <Stack className="brand-section" sx={{ mb: 3 }}>
    <Stack
      direction="row"
      alignItems="center"
      onClick={toggle}
      style={{ cursor: 'pointer' }}
    >
      <Typography className="title" sx={sectionTitleStyle}>
        {title}
      </Typography>
      {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
    </Stack>
    <Collapse in={open}>
      <div className="brand-grid">
        {items.map((item) => (
          <div className="brand-item" key={item}>
            <Checkbox
              className="watch-checkbox"
              checked={checkedFn(item)}
              onChange={onChange}
              value={item}
              sx={checkboxStyle}
            />
            <span className="watch-type" style={{ fontSize: 14 }}>
              {item}
            </span>
          </div>
        ))}
      </div>
    </Collapse>
  </Stack>
);
