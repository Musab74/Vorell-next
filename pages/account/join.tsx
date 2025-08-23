import React, { useCallback, useMemo, useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Stack,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { useRouter } from 'next/router';
import { logIn, signUp } from '../../libs/auth';
import { sweetMixinErrorAlert } from '../../libs/sweetAlert';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});

const Join: NextPage = () => {
  const router = useRouter();
  const device = useDeviceDetect();
  const [loginView, setLoginView] = useState<boolean>(true);

  const [input, setInput] = useState({
    nick: '',
    password: '',
    phone: '',
    type: 'USER' as 'USER' | 'STORE', // ⬅️ AGENT removed (backend rejects it)
  });
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  /** HANDLERS **/
  const handleInput = useCallback((name: keyof typeof input, value: string) => {
    setInput((prev) => ({ ...prev, [name]: value }));
  }, []);

  const switchView = (toLogin: boolean) => setLoginView(toLogin);

  const changeType = (_: any, next: 'USER' | 'STORE' | null) => {
    if (next) handleInput('type', next);
  };

  const doLogin = useCallback(async () => {
    try {
      setLoading(true);
      await logIn(input.nick.trim(), input.password);
      await router.push(`${router.query.referrer ?? '/'}`);
    } catch (err: any) {
      await sweetMixinErrorAlert(err.message);
    } finally {
      setLoading(false);
    }
  }, [input, router]);

  const doSignUp = useCallback(async () => {
    try {
      setLoading(true);
      await signUp(input.nick.trim(), input.password, input.phone.trim(), input.type);
      await router.push(`${router.query.referrer ?? '/'}`);
    } catch (err: any) {
      await sweetMixinErrorAlert(err.message);
    } finally {
      setLoading(false);
    }
  }, [input, router]);

  const canLogin = useMemo(() => input.nick.trim() && input.password.length >= 6, [input]);
  const canSignup = useMemo(
    () => input.nick.trim() && input.password.length >= 6 && input.phone.trim() && input.type,
    [input]
  );

  /* MOBILE */
  if (device === 'mobile') {
    return (
      <Stack className="join-page mobile">
        <Stack className="container">
          <Stack className="main glass">
            <Box className="left">
              <Box className="logo">
                <img src="/img/logo/vorell-Gold.png" alt="Vorell" />
                <span>Vorell</span>
              </Box>

              <Box className="info">
                <span>{loginView ? 'LOGIN' : 'SIGNUP'}</span>
                <p>{loginView ? 'Welcome back to Vorell.' : 'Create your Vorell account.'}</p>
              </Box>

              <Box className="input-wrap">
                <div className="input-box">
                  <span>Nickname</span>
                  <input
                    type="text"
                    placeholder="Enter Nickname"
                    onChange={(e) => handleInput('nick', e.target.value)}
                    required
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') (loginView ? doLogin() : doSignUp());
                    }}
                  />
                </div>

                <div className="input-box">
                  <span>Password</span>
                  <div className="password-field">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Min 6 characters"
                      onChange={(e) => handleInput('password', e.target.value)}
                      required
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') (loginView ? doLogin() : doSignUp());
                      }}
                    />
                    <IconButton className="toggle" onClick={() => setShowPassword((s) => !s)} size="small">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </div>
                </div>

                {!loginView && (
                  <div className="input-box">
                    <span>Phone</span>
                    <input
                      type="tel"
                      placeholder="Enter Phone"
                      onChange={(e) => handleInput('phone', e.target.value)}
                      required
                      onKeyDown={(e) => e.key === 'Enter' && doSignUp()}
                    />
                  </div>
                )}
              </Box>

              <Box className="register">
                {!loginView && (
                  <div className="type-option">
                    <span className="text">Register as</span>
                    <ToggleButtonGroup
                      size="small"
                      color="primary"
                      value={input.type}
                      exclusive
                      onChange={changeType}
                      className="type-group"
                    >
                      <ToggleButton value="USER">User</ToggleButton>
                      <ToggleButton value="STORE">Store</ToggleButton>
                    </ToggleButtonGroup>
                  </div>
                )}

                {loginView && (
                  <div className="remember-info">
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            size="small"
                            checked={remember}
                            onChange={(e) => setRemember(e.target.checked)}
                          />
                        }
                        label="Remember me"
                      />
                    </FormGroup>
                    <a>Forgot password?</a>
                  </div>
                )}

                {loginView ? (
                  <Button
                    variant="contained"
                    endIcon={<img src="/img/icons/rightup.svg" alt="" />}
                    disabled={!canLogin || loading}
                    onClick={doLogin}
                  >
                    {loading ? 'Logging in…' : 'LOGIN'}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    endIcon={<img src="/img/icons/rightup.svg" alt="" />}
                    disabled={!canSignup || loading}
                    onClick={doSignUp}
                  >
                    {loading ? 'Creating…' : 'SIGNUP'}
                  </Button>
                )}
              </Box>

              <Box className="ask-info">
                {loginView ? (
                  <p>
                    Not registered yet?
                    <b onClick={() => switchView(false)}> SIGNUP</b>
                  </p>
                ) : (
                  <p>
                    Have an account?
                    <b onClick={() => switchView(true)}> LOGIN</b>
                  </p>
                )}
              </Box>
            </Box>

            <Box className="right">
              <div className="video-wrap">
                <video
                  src="https://www.omegawatches.co.kr/media/wysiwyg/video/diver300m-desktop.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  poster="/img/banner/joinBg.svg"
                />
              </div>
            </Box>
          </Stack>
        </Stack>
      </Stack>
    );
  }

  /* DESKTOP */
  return (
    <Stack className="join-page">
      <Stack className="container">
        <Stack className="main glass">
          {/* LEFT (form) */}
          <Stack className="left">
            <Box className="logo">
              <img src="/img/logo/vorell-Gold.png" alt="Vorell" />
              <span>Vorell</span>
            </Box>

            <Box className="info">
              <span>{loginView ? 'LOGIN' : 'SIGNUP'}</span>
              <p>{loginView ? 'Welcome back to Vorell.' : 'Create your Vorell account.'}</p>
            </Box>

            <Box className="input-wrap">
              <div className="input-box">
                <span>Nickname</span>
                <input
                  type="text"
                  placeholder="Enter Nickname"
                  onChange={(e) => handleInput('nick', e.target.value)}
                  required
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') (loginView ? doLogin() : doSignUp());
                  }}
                />
              </div>

              <div className="input-box">
                <span>Password</span>
                <div className="password-field">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min 6 characters"
                    onChange={(e) => handleInput('password', e.target.value)}
                    required
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') (loginView ? doLogin() : doSignUp());
                    }}
                  />
                  <IconButton className="toggle" onClick={() => setShowPassword((s) => !s)} size="small">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </div>
              </div>

              {!loginView && (
                <div className="input-box">
                  <span>Phone</span>
                  <input
                    type="tel"
                    placeholder="Enter Phone"
                    onChange={(e) => handleInput('phone', e.target.value)}
                    required
                    onKeyDown={(e) => e.key === 'Enter' && doSignUp()}
                  />
                </div>
              )}
            </Box>

            <Box className="register">
              {!loginView && (
                <div className="type-option">
				<span className="text">Register as</span>
				<div className="type-group-wrap">
				  <ToggleButtonGroup
					size="small"
					color="primary"
					value={input.type}
					exclusive
					onChange={changeType}
					className="type-group"
				  >
					<ToggleButton value="USER">User</ToggleButton>
					<ToggleButton value="STORE">Store</ToggleButton>
				  </ToggleButtonGroup>
				</div>
			  </div>
			  
              )}

              {loginView && (
                <div className="remember-info">
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          checked={remember}
                          onChange={(e) => setRemember(e.target.checked)}
                        />
                      }
                      label="Remember me"
                    />
                  </FormGroup>
                  <a>Forgot password?</a>
                </div>
              )}

              {loginView ? (
                <Button
                  variant="contained"
                  endIcon={<img src="/img/icons/rightup.svg" alt="" />}
                  disabled={!canLogin || loading}
                  onClick={doLogin}
                >
                  {loading ? 'Logging in…' : 'LOGIN'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  endIcon={<img src="/img/icons/rightup.svg" alt="" />}
                  disabled={!canSignup || loading}
                  onClick={doSignUp}
                >
                  {loading ? 'Creating…' : 'SIGNUP'}
                </Button>
              )}
            </Box>

            <Box className="ask-info">
              {loginView ? (
                <p>
                  Not registered yet?
                  <b onClick={() => switchView(false)}> SIGNUP</b>
                </p>
              ) : (
                <p>
                  Have an account?
                  <b onClick={() => switchView(true)}> LOGIN</b>
                </p>
              )}
            </Box>
          </Stack>

          {/* RIGHT (video) */}
          <Stack className="right">
            <div className="video-wrap">
              <video
                src="https://www.omegawatches.co.kr/media/wysiwyg/video/diver300m-desktop.mp4"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster="/img/banner/joinBg.svg"
              />
              <div className="overlay" />
            </div>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default withLayoutBasic(Join);
