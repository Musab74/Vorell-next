import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Badge,
} from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import Logout from '@mui/icons-material/Logout';
import PersonOutline from '@mui/icons-material/PersonOutline';
import { CaretDown } from 'phosphor-react';
import { useTranslation } from 'next-i18next';

import { useReactiveVar, useQuery } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { GET_FAVORITES } from '../../apollo/user/query';

import useDeviceDetect from '../hooks/useDeviceDetect';
import { getJwtToken, logOut, updateUserInfo } from '../auth';
import { REACT_APP_API_URL } from '../config';

const LANGS = [
  { code: 'en', label: 'English', short: 'EN', icon: '/img/flag/langen.png' },
  { code: 'kr', label: 'Korean',  short: 'KR', icon: '/img/flag/langkr.png' },
  { code: 'ru', label: 'Russian', short: 'RU', icon: '/img/flag/langru.png' },
];

const NAV_LINKS = [
  { href: '/', labelKey: 'Home', fallback: 'Home' },
  { href: '/watches', labelKey: 'Watches', fallback: 'Watches' },
  { href: '/store', labelKey: 'Stores', fallback: 'Stores' },
  { href: '/community', labelKey: 'Community', fallback: 'Community' },
  { href: '/mypage', labelKey: 'My Page', fallback: 'My Page', authOnly: true },
  { href: '/cs', labelKey: 'CS', fallback: 'CS' },
];

const StyledMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 10,
    marginTop: theme.spacing(1),
    minWidth: 200,
    color: theme.palette.mode === 'light' ? '#2b2d31' : theme.palette.grey[300],
    boxShadow:
      'rgba(0,0,0,0.04) 0px 1px 0px 0px, rgba(0,0,0,0.10) 0px 8px 24px',
    '& .MuiMenu-list': { padding: '6px 0' },
    '& .MuiMenuItem-root': {
      fontWeight: 600,
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
      },
    },
  },
}));

const Top: React.FC = () => {
  const device = useDeviceDetect();
  const user = useReactiveVar(userVar);
  const router = useRouter();
  const { t } = useTranslation('common');

  // Scroll + show/hide behavior
  const [scrolled, setScrolled] = useState(false);
  const [show, setShow] = useState(true);
  const lastScroll = useRef(0);

  // Language menu
  const [lang, setLang] = useState<string>('en');
  const [langAnchor, setLangAnchor] = useState<null | HTMLElement>(null);

  // Profile menu
  const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null);

  // Favorites badge count
  const [favCount, setFavCount] = useState<number>(0);

  /** LIFECYCLES **/
  useEffect(() => {
    // hydrate user if token exists
    const jwt = getJwtToken();
    if (jwt) updateUserInfo(jwt);

    // init language
    const stored = (typeof window !== 'undefined' && localStorage.getItem('locale')) || router.locale || 'en';
    setLang(stored);
  }, []); // eslint-disable-line

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      if (y > lastScroll.current && y > window.innerHeight / 2) setShow(false);
      else setShow(true);
      lastScroll.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /** Favorites count query **/
  const { refetch: refetchFavCount } = useQuery(GET_FAVORITES, {
    skip: !user?._id,
    fetchPolicy: 'network-only',
    variables: { input: { page: 1, limit: 1 } },
    onCompleted: (data: any) => {
      const total = data?.getFavorites?.metaCounter?.[0]?.total ?? 0;
      setFavCount(total);
    },
  });

  useEffect(() => {
    if (user?._id) {
      refetchFavCount();
    } else {
      setFavCount(0);
    }
  }, [user?._id]); // eslint-disable-line

  useEffect(() => {
    const handleRoute = () => { if (user?._id) refetchFavCount(); };
    router.events.on('routeChangeComplete', handleRoute);
    return () => router.events.off('routeChangeComplete', handleRoute);
  }, [user?._id, router.events]); // eslint-disable-line

  /** HANDLERS **/
  const isActive = useCallback(
    (href: string) =>
      href === '/'
        ? router.pathname === '/'
        : router.pathname === href || router.pathname.startsWith(href + '/'),
    [router.pathname]
  );

  const openLang = (e: React.MouseEvent<HTMLButtonElement>) => setLangAnchor(e.currentTarget);
  const closeLang = () => setLangAnchor(null);

  const switchLang = async (code: string) => {
    setLang(code);
    if (typeof window !== 'undefined') localStorage.setItem('locale', code);
    closeLang();
    await router.push(router.asPath, router.asPath, { locale: code });
  };

  const openProfile = (e: React.MouseEvent<HTMLElement>) => setProfileAnchor(e.currentTarget);
  const closeProfile = () => setProfileAnchor(null);

  const doLogout = async () => {
    closeProfile();
    logOut();
    await router.push('/');
  };

  const goToFavorites = () => {
    if (!user?._id) router.push('/account/join');
    else router.push("/mypage?category=myFavorites");
  };

  /** Favorite Nav Item **/
  const FavoriteNavItem = () => (
    <button
      onClick={goToFavorites}
      className="nav-item"
      aria-label="Favorites"
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
      }}
    >
      <span
        style={{
          position: 'relative',
          width: 28,
          height: 28,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {favCount > 0 ? (
          <FavoriteIcon className="nav-icon" style={{ fontSize: 22, color: '#d32f2f' }} />
        ) : (
          <FavoriteBorderIcon className="nav-icon" style={{ fontSize: 22 }} />
        )}
        {favCount > 0 && (
          <span
            style={{
              position: 'absolute',
              left: -4,
              top: -6,
              minWidth: 18,
              height: 18,
              padding: '0 5px',
              borderRadius: 999,
              background: '#2b6b4f',
              color: '#fff',
              fontSize: 11,
              fontWeight: 700,
              lineHeight: '18px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 0 2px rgba(0,0,0,0.06)',
            }}
          >
            {favCount}
          </span>
        )}
      </span>
      <span style={{ fontWeight: 600 }}>{t('Favorites', 'Favorites')}</span>
    </button>
  );

  /** RENDER — mobile **/
  if (device === 'mobile') {
    return (
      <header className="luxe-navbar mobile">
        <div className="navbar-main">
          <Link href="/" className="logo-link">
            <img src="/img/logo/vorell-gold.png" alt="Vorell" className="center-logo" />
          </Link>
          <div className="spacer" />
          {user?._id ? (
            <>
              <FavoriteNavItem />
              <IconButton onClick={openProfile} size="small">
                <img
                  src={user?.memberImage ? `${REACT_APP_API_URL}/${user.memberImage}` : '/img/profile/defaultUser.svg'}
                  alt="me"
                  style={{ width: 28, height: 28, borderRadius: '50%' }}
                />
              </IconButton>
              <StyledMenu anchorEl={profileAnchor} open={Boolean(profileAnchor)} onClose={closeProfile}>
                <MenuItem onClick={() => { closeProfile(); router.push('/mypage'); }}>
                  <PersonOutline fontSize="small" /> My Page
                </MenuItem>
                <MenuItem onClick={doLogout}>
                  <Logout fontSize="small" /> Logout
                </MenuItem>
              </StyledMenu>
            </>
          ) : (
            <>
              <FavoriteNavItem />
              <Link href="/account/join" className="join-box">
                <AccountCircleOutlinedIcon />
                <span>Login / Register</span>
              </Link>
            </>
          )}
        </div>
      </header>
    );
  }

  /** RENDER — desktop **/
  return (
    <header className={`luxe-navbar${scrolled ? ' scrolled' : ''}${!show ? ' hide' : ''}`}>
      <div className="navbar-main">
        {/* LEFT: NAV LINKS */}
        <nav className="nav-links-left">
          {NAV_LINKS.filter((l) => !l.authOnly || !!user?._id).map((l) => (
            <Link
              href={l.href}
              key={l.href}
              className={`nav-link${isActive(l.href) ? ' active' : ''}`}
            >
              {t(l.labelKey, l.fallback)}
            </Link>
          ))}
        </nav>

        {/* CENTER: LOGO */}
        <div className="nav-center-logo">
          <Link href="/" className="logo-link">
            <img src="/img/logo/vorell-gold.png" alt="Vorell Logo" className="center-logo" />
          </Link>
        </div>

        {/* RIGHT: FAV / AUTH / LANG */}
        <div className="nav-links-right">
          <FavoriteNavItem />

          {!user?._id ? (
            <Link href="/account/join" className="join-box">
              <AccountCircleOutlinedIcon />
              <span>{t('Login', 'Login')} / {t('Register', 'Register')}</span>
            </Link>
          ) : (
            <>
              <IconButton className="notif-btn" onClick={() => router.push('/notifications')}>
                <Badge color="error" variant="dot" overlap="circular">
                  <NotificationsOutlinedIcon className="nav-icon" />
                </Badge>
              </IconButton>

              <IconButton className="avatar-btn" onClick={openProfile} sx={{ p: 0 }}>
                <img
                  src={user?.memberImage ? `${REACT_APP_API_URL}/${user.memberImage}` : '/img/profile/defaultUser.svg'}
                  alt="me"
                  style={{ width: 34, height: 34, borderRadius: '50%' }}
                />
              </IconButton>

              <StyledMenu
                anchorEl={profileAnchor}
                open={Boolean(profileAnchor)}
                onClose={closeProfile}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MenuItem onClick={() => { closeProfile(); router.push('/mypage'); }}>
                  <PersonOutline fontSize="small" /> {t('My Page', 'My Page')}
                </MenuItem>
                <MenuItem onClick={doLogout}>
                  <Logout fontSize="small" /> {t('Logout', 'Logout')}
                </MenuItem>
              </StyledMenu>
            </>
          )}

          {/* Language */}
          <div className="lang-switcher">
            <Button
              disableRipple
              className="btn-lang"
              onClick={openLang}
              endIcon={<CaretDown size={13} color="#616161" weight="fill" />}
            >
              <img
                src={LANGS.find((l) => l.code === lang)?.icon || '/img/flag/langen.png'}
                alt={lang}
              />
              {LANGS.find((l) => l.code === lang)?.short || 'EN'}
            </Button>
            <StyledMenu anchorEl={langAnchor} open={Boolean(langAnchor)} onClose={closeLang}>
              {LANGS.map((l) => (
                <MenuItem key={l.code} onClick={() => switchLang(l.code)}>
                  <img src={l.icon} alt={l.label} style={{ width: 22, marginRight: 8 }} />
                  {l.label}
                </MenuItem>
              ))}
            </StyledMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Top;
