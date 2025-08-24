import React from 'react';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import TelegramIcon from '@mui/icons-material/Telegram';
import TwitterIcon from '@mui/icons-material/Twitter';
import useDeviceDetect from '../hooks/useDeviceDetect';
import { Stack, Box } from '@mui/material';
import moment from 'moment';

const Footer = () => {
  const device = useDeviceDetect();

  const contactPhone = '+82 10 4867 2909';
  const brand = 'Vorell';
  const logoPath = '/img/logo/vorell-gold.png';

  if (device === 'mobile') {
    return (
      <Stack component="div" className="footer-container">
        <Stack component="div" className="main">
          <Stack component="div" className="left">
            <Box component="div" className="footer-box">
              <img src={logoPath} alt="Vorell Logo" className="logo" style={{ height: 36 }} />
            </Box>

            <Box component="div" className="footer-box">
              <span>Customer Care</span>
              <p>{contactPhone}</p>
            </Box>

            <Box component="div" className="footer-box">
              <span>Live Support</span>
              <p>{contactPhone}</p>
              <span>Need Help?</span>
            </Box>

            <Box component="div" className="footer-box">
              <p>Follow us on social media</p>
              <div className="media-box">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FacebookOutlinedIcon /></a>
                <a href="https://t.me" target="_blank" rel="noopener noreferrer"><TelegramIcon /></a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><InstagramIcon /></a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><TwitterIcon /></a>
              </div>
            </Box>
          </Stack>

          <Stack component="div" className="right">
            <Box component="div" className="bottom">
              <div>
                <strong>Popular Search</strong>
                <span>Luxury Watches</span>
                <span>Latest Collections</span>
              </div>
              <div>
                <strong>Quick Links</strong>
                <span>Terms of Use</span>
                <span>Privacy Policy</span>
                <span>Pricing Plans</span>
                <span>Our Services</span>
                <span>Contact Support</span>
                <span>FAQs</span>
              </div>
              <div>
                <strong>Discover</strong>
                <span>Seoul</span>
                <span>Gyeonggi-do</span>
                <span>Busan</span>
                <span>Jeju-do</span>
              </div>
            </Box>
          </Stack>
        </Stack>

        <Stack component="div" className="second">
          <span>© {brand} – All rights reserved. {brand} {moment().year()}</span>
        </Stack>
      </Stack>
    );
  }

  // DESKTOP
  return (
    <Stack component="div" className="footer-container">
      <Stack component="div" className="main">
        <Stack component="div" className="left">
          <Box component="div" className="footer-box">
            <img src={logoPath} alt="Vorell Logo" className="logo" style={{ height: 48 }} />
          </Box>

          <Box component="div" className="footer-box">
            <span>Customer Care</span>
            <p>{contactPhone}</p>
          </Box>

          <Box component="div" className="footer-box">
            <span>Live Support</span>
            <p>{contactPhone}</p>
            <span>Need Help?</span>
          </Box>

          <Box component="div" className="footer-box">
            <p>Follow us on social media</p>
            <div className="media-box">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FacebookOutlinedIcon /></a>
              <a href="https://t.me" target="_blank" rel="noopener noreferrer"><TelegramIcon /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><InstagramIcon /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><TwitterIcon /></a>
            </div>
          </Box>
        </Stack>

        <Stack component="div" className="right">
          <Box component="div" className="top">
            <strong>Keep yourself up to date</strong>
            <div>
              <input type="text" placeholder="Your Email" />
              <span>Subscribe</span>
            </div>
          </Box>

          <Box component="div" className="bottom">
            <div>
              <strong>Popular Search</strong>
              <span>Luxury Watches</span>
              <span>Latest Collections</span>
            </div>
            <div>
              <strong>Quick Links</strong>
              <span>Terms of Use</span>
              <span>Privacy Policy</span>
              <span>Pricing Plans</span>
              <span>Our Services</span>
              <span>Contact Support</span>
              <span>FAQs</span>
            </div>
            <div>
              <strong>Origins</strong>
              <span>KOREA</span>
              <span>USA</span>
              <span>SWITZERLAND</span>
              <span>DENMARK</span>
            </div>
          </Box>
        </Stack>
      </Stack>

      <Stack component="div" className="second">
        <span>© {brand} – All rights reserved. {brand} {moment().year()}</span>
        <span>Privacy · Terms · Sitemap</span>
      </Stack>
    </Stack>
  );
};

export default Footer;
