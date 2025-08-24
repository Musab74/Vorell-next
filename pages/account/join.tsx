import React, { useCallback, useMemo, useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
  import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { logIn, signUp } from '../../libs/auth';
import { sweetMixinErrorAlert } from '../../libs/sweetAlert';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'auth'])),
  },
});

type MemberType = 'USER' | 'STORE';

/** Right column video — full-bleed inside the right stack */
const JoinRightVideo = React.memo(function JoinRightVideo() {
  return (
    <div
      className="right"
      style={{
        position: 'relative',
        flex: 1,           
        height: '100%',    
        minHeight: 420,    
        borderRadius: 12,
        overflow: 'hidden',
      }}
    >
      <video
        src="https://www.omegawatches.co.kr/media/wysiwyg/video/diver300m-desktop.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/img/banner/joinBg.svg"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover', // fill area with minimal zoom
          display: 'block',
        }}
      />
      {/* inert overlay (keeps inputs clickable) */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
    </div>
  );
});


const Join: NextPage = () => {
  const router = useRouter();
  const device = useDeviceDetect();
  const { t } = useTranslation('auth');

  const [loginView, setLoginView] = useState<boolean>(true);
  const [input, setInput] = useState({
    nick: '',
    password: '',
    phone: '',
    type: 'USER' as MemberType,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  /** HANDLERS **/
  const handleInput = useCallback((name: keyof typeof input, value: string) => {
    setInput((prev) => ({ ...prev, [name]: value }));
  }, []);

  const switchView = (toLogin: boolean) => setLoginView(toLogin);

  const changeType = (_: unknown, next: MemberType | null) => {
    if (next) handleInput('type', next);
  };

  const navTarget = useMemo(() => {
    const ref = router.query.referrer;
    return typeof ref === 'string' && ref.trim() ? ref : '/';
  }, [router.query.referrer]);

  const doLogin = useCallback(async () => {
    try {
      setLoading(true);
      await logIn(input.nick.trim(), input.password);
      await router.replace(navTarget);
    } catch (err: any) {
      await sweetMixinErrorAlert(err?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }, [input.nick, input.password, navTarget, router]);

  const doSignUp = useCallback(async () => {
    try {
      setLoading(true);
      await signUp(input.nick.trim(), input.password, input.phone.trim(), input.type);
      await logIn(input.nick.trim(), input.password); // auto-login
      await router.replace(navTarget);
    } catch (err: any) {
      await sweetMixinErrorAlert(err?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  }, [input.nick, input.password, input.phone, input.type, navTarget, router]);

  const canLogin = useMemo(() => !!input.nick.trim() && input.password.length >= 6, [input]);
  const canSignup = useMemo(
    () => !!input.nick.trim() && input.password.length >= 6 && !!input.phone.trim() && !!input.type,
    [input]
  );

  const handleEnter = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') (loginView ? doLogin() : doSignUp());
    },
    [loginView, doLogin, doSignUp]
  );

  const TITLE = loginView ? t('login.title') : t('signup.title');
  const SUB = loginView ? t('login.subtitle') : t('signup.subtitle');

  /** ===== MOBILE ===== */
  if (device === 'mobile') {
    return (
      <div className="join-page mobile">
        <div className="container">
          <div className="main glass" style={{ position: 'relative' }}>
            <div className="left" style={{ position: 'relative', zIndex: 2 }}>
              <div className="logo">
                <img src="/img/logo/vorell-gold.png" alt="Vorell" />
                <span>Vorell</span>
              </div>

              <div className="info">
                <span>{TITLE}</span>
                <p>{SUB}</p>
              </div>

              <div className="input-wrap">
                <div className="input-box">
                  <span>{t('fields.nickname.label')}</span>
                  <input
                    type="text"
                    placeholder={t('fields.nickname.placeholder')}
                    value={input.nick}
                    onChange={(e) => handleInput('nick', e.target.value)}
                    required
                    onKeyDown={handleEnter}
                  />
                </div>

                <div className="input-box">
                  <span>{t('fields.password.label')}</span>
                  <div className="password-field">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder={t('fields.password.placeholder')}
                      value={input.password}
                      onChange={(e) => handleInput('password', e.target.value)}
                      required
                      onKeyDown={handleEnter}
                      autoComplete="current-password"
                    />
                    <IconButton className="toggle" onClick={() => setShowPassword((s) => !s)} size="small" tabIndex={-1}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </div>
                </div>

                {!loginView && (
                  <div className="input-box">
                    <span>{t('fields.phone.label')}</span>
                    <input
                      type="tel"
                      placeholder={t('fields.phone.placeholder')}
                      value={input.phone}
                      onChange={(e) => handleInput('phone', e.target.value)}
                      required
                      onKeyDown={handleEnter}
                      autoComplete="tel"
                    />
                  </div>
                )}
              </div>

              <div className="register">
                {!loginView && (
                  <div className="type-option">
                    <span className="text">{t('signup.registerAs')}</span>
                    <div className="type-group-wrap">
                      <ToggleButtonGroup
                        size="small"
                        color="primary"
                        value={input.type}
                        exclusive
                        onChange={changeType}
                        className="type-group"
                      >
                        <ToggleButton value="USER">{t('signup.user')}</ToggleButton>
                        <ToggleButton value="STORE">{t('signup.store')}</ToggleButton>
                      </ToggleButtonGroup>
                    </div>
                  </div>
                )}

                {loginView && (
                  <div className="remember-info">
                    <FormGroup>
                      <FormControlLabel
                        control={<Checkbox size="small" checked={remember} onChange={(e) => setRemember(e.target.checked)} />}
                        label={t('login.rememberMe')}
                      />
                    </FormGroup>
                    <a>{t('login.forgotPassword')}</a>
                  </div>
                )}

                {loginView ? (
                  <Button variant="contained" endIcon={<img src="/img/icons/rightup.svg" alt="" />} disabled={!canLogin || loading} onClick={doLogin}>
                    {loading ? t('login.loading') : t('login.cta')}
                  </Button>
                ) : (
                  <Button variant="contained" endIcon={<img src="/img/icons/rightup.svg" alt="" />} disabled={!canSignup || loading} onClick={doSignUp}>
                    {loading ? t('signup.loading') : t('signup.cta')}
                  </Button>
                )}
              </div>

              <div className="ask-info">
                {loginView ? (
                  <p>
                    {t('signupPrompt.text')} <b onClick={() => switchView(false)}>{t('signupPrompt.link')}</b>
                  </p>
                ) : (
                  <p>
                    {t('loginPrompt.text')} <b onClick={() => switchView(true)}>{t('loginPrompt.link')}</b>
                  </p>
                )}
              </div>
            </div>

            {/* Keep a smaller media card on mobile as well */}
            <div style={{ width: '100%' }}>
              <div style={{ padding: '16px 16px 24px' }}>
                <div
                  style={{
                    borderRadius: 14,
                    overflow: 'hidden',
                    boxShadow: '0 10px 28px rgba(24,26,32,.12)',
                    background: '#000',
                    height: 220,
                    position: 'relative',
                  }}
                >
                  <video
                    src="https://www.omegawatches.co.kr/media/wysiwyg/video/diver300m-desktop.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    poster="/img/banner/joinBg.svg"
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /** ===== DESKTOP ===== */
  return (
    <div className="join-page">
      <div className="container">
        <div className="main glass" style={{ position: 'relative' }}>
          <div className="left" style={{ position: 'relative', zIndex: 2 }}>
            <div className="logo">
              <img src="/img/logo/vorell-gold.png" alt="Vorell" />
              <span>Vorell</span>
            </div>

            <div className="info">
              <span>{TITLE}</span>
              <p>{SUB}</p>
            </div>

            <div className="input-wrap">
              <div className="input-box">
                <span>{t('fields.nickname.label')}</span>
                <input
                  type="text"
                  placeholder={t('fields.nickname.placeholder')}
                  value={input.nick}
                  onChange={(e) => handleInput('nick', e.target.value)}
                  required
                  onKeyDown={handleEnter}
                />
              </div>

              <div className="input-box">
                <span>{t('fields.password.label')}</span>
                <div className="password-field">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('fields.password.placeholder')}
                    value={input.password}
                    onChange={(e) => handleInput('password', e.target.value)}
                    required
                    onKeyDown={handleEnter}
                    autoComplete="current-password"
                  />
                  <IconButton className="toggle" onClick={() => setShowPassword((s) => !s)} size="small" tabIndex={-1}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </div>
              </div>

              {!loginView && (
                <div className="input-box">
                  <span>{t('fields.phone.label')}</span>
                  <input
                    type="tel"
                    placeholder={t('fields.phone.placeholder')}
                    value={input.phone}
                    onChange={(e) => handleInput('phone', e.target.value)}
                    required
                    onKeyDown={handleEnter}
                    autoComplete="tel"
                  />
                </div>
              )}
            </div>

            <div className="register">
              {!loginView && (
                <div className="type-option">
                  <span className="text">{t('signup.registerAs')}</span>
                  <div className="type-group-wrap">
                    <ToggleButtonGroup
                      size="small"
                      color="primary"
                      value={input.type}
                      exclusive
                      onChange={changeType}
                      className="type-group"
                    >
                      <ToggleButton value="USER">{t('signup.user')}</ToggleButton>
                      <ToggleButton value="STORE">{t('signup.store')}</ToggleButton>
                    </ToggleButtonGroup>
                  </div>
                </div>
              )}

              {loginView && (
                <div className="remember-info">
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox size="small" checked={remember} onChange={(e) => setRemember(e.target.checked)} />}
                      label={t('login.rememberMe')}
                    />
                  </FormGroup>
                  <a>{t('login.forgotPassword')}</a>
                </div>
              )}

              {loginView ? (
                <Button variant="contained" endIcon={<img src="/img/icons/rightup.svg" alt="" />} disabled={!canLogin || loading} onClick={doLogin}>
                  {loading ? t('login.loading') : t('login.cta')}
                </Button>
              ) : (
                <Button variant="contained" endIcon={<img src="/img/icons/rightup.svg" alt="" />} disabled={!canSignup || loading} onClick={doSignUp}>
                  {loading ? t('signup.loading') : t('signup.cta')}
                </Button>
              )}
            </div>

            <div className="ask-info">
              {loginView ? (
                <p>
                  {t('signupPrompt.text')} <b onClick={() => switchView(false)}>{t('signupPrompt.link')}</b>
                </p>
              ) : (
                <p>
                  {t('loginPrompt.text')} <b onClick={() => switchView(true)}>{t('loginPrompt.link')}</b>
                </p>
              )}
            </div>
          </div>

          {/* Right column: top-aligned, squeezed media just like login */}
          <JoinRightVideo />
        </div>
      </div>
    </div>
  );
};

export default withLayoutBasic(Join);
