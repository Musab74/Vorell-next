import React, { SyntheticEvent, useState } from 'react';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import { AccordionDetails, Box, Stack, Typography } from '@mui/material';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import { styled } from '@mui/material/styles';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import useDeviceDetect from '../../hooks/useDeviceDetect';

/** ------------ Styled wrappers (same as your original) ------------ */
const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': { borderBottom: 0 },
  '&:before': { display: 'none' },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary expandIcon={<KeyboardArrowDownRoundedIcon sx={{ fontSize: '1.4rem' }} />} {...props} />
))(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,.05)' : '#fff',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': { transform: 'rotate(180deg)' },
  '& .MuiAccordionSummary-content': { marginLeft: theme.spacing(1) },
}));

/** ------------ Component ------------ */
const Faq: React.FC = () => {
  const device = useDeviceDetect();

  // Categories for Vorell – Luxury Watch Sale Website
  const [category, setCategory] = useState<string>('watches');
  const [expanded, setExpanded] = useState<string | false>('panel1');

  const changeCategoryHandler = (next: string) => setCategory(next);
  const handleChange = (panel: string) => (_e: SyntheticEvent, newExpanded: boolean) =>
    setExpanded(newExpanded ? panel : false);

  /** ------------ FAQ data (watch-specific) ------------ */
  const data: Record<string, Array<{ id: string; subject: string; content: string }>> = {
    watches: [
      { id: 'w-1', subject: 'Are the watches on Vorell authentic?', content: 'Yes. Every watch is inspected by our in-house experts. We verify serial/reference numbers, movement, case/bracelet stamps and provide authenticity guarantees.' },
      { id: 'w-2', subject: 'Do you sell new or pre-owned watches?', content: 'We offer both. Each listing clearly states “New”, “Unworn”, or “Pre-owned” with a detailed condition grade and live photos.' },
      { id: 'w-3', subject: 'What condition grades do you use?', content: 'New • Unworn • Like New (Mint) • Excellent • Very Good • Good. Each grade includes a description of hairlines, polishing history, and any notable marks.' },
      { id: 'w-4', subject: 'Is the watch water-resistant?', content: 'Water resistance varies by model and age. Vintage pieces may not be suitable for water. We recommend a pressure test after service before any exposure to water.' },
      { id: 'w-5', subject: 'Do you provide the full set (box & papers)?', content: 'If available, the listing mentions “Full Set”, “Box Only”, “Papers Only”, or “Watch Only”. Photos reflect the exact inclusions.' },
      { id: 'w-6', subject: 'Can I size the bracelet before shipping?', content: 'Yes. Provide wrist size at checkout and we’ll size it prior to dispatch. Any removed links are included in the package.' },
      { id: 'w-7', subject: 'What about service history and polishing?', content: 'Where known, we disclose service dates and whether a watch has been polished. Our technicians perform timekeeping and functions checks pre-shipment.' },
      { id: 'w-8', subject: 'Can I request additional photos or a video?', content: 'Absolutely. Contact support with the listing ID and we’ll share additional angles or a short video under studio lighting.' },
      { id: 'w-9', subject: 'Do you take special orders for hard-to-find models?', content: 'Yes. Use “Source a Watch” and our network will search for your requested reference, budget, and condition.' },
      { id: 'w-10', subject: 'Do you offer appraisals for insurance?', content: 'We can issue a digital appraisal after purchase with the serial, model, and value for your insurer.' },
    ],

    buyers: [
      { id: 'b-1', subject: 'How do I choose the right size?', content: 'Most modern men’s watches are 36–42 mm. Check your wrist circumference and compare to case diameter and lug-to-lug. We can advise if you send a wrist photo and measurement.' },
      { id: 'b-2', subject: 'Can I reserve a watch?', content: 'Short reservations are possible with a refundable deposit. Contact support to arrange a hold window.' },
      { id: 'b-3', subject: 'Do you offer price negotiations?', content: 'Select listings allow offers. Use the “Make an Offer” button where available; our team responds promptly.' },
      { id: 'b-4', subject: 'Is there a return window?', content: 'Yes—see Returns below. Watches must be in the same condition with all accessories and security tags intact.' },
      { id: 'b-5', subject: 'Can I trade in my watch toward a purchase?', content: 'Yes. Submit reference, photos, and condition. We’ll evaluate and provide a trade-in quote you can apply at checkout.' },
      { id: 'b-6', subject: 'Do you ship internationally?', content: 'We ship worldwide via insured carriers (DHL/FedEx). Duties and taxes are charged by your local customs office.' },
      { id: 'b-7', subject: 'Will my order be insured in transit?', content: 'Yes, shipments are fully insured until delivery and signature confirmation.' },
      { id: 'b-8', subject: 'Do you adjust the time/date before shipping?', content: 'Yes, we perform a final QC (accuracy, amplitude, functions) and set the time stopped to preserve power-reserve on arrival.' },
      { id: 'b-9', subject: 'How do I check my order status?', content: 'You’ll receive tracking details by email. You can also view live status in your Vorell account → Orders.' },
      { id: 'b-10', subject: 'Can I pick up in person?', content: 'In-person collection may be arranged at our showroom by appointment after ID verification.' },
    ],

    payment: [
      { id: 'p-1', subject: 'Which payment methods are accepted?', content: 'Credit/debit cards, bank transfer, and select wallets. For high-value orders we may request bank transfer for security.' },
      { id: 'p-2', subject: 'Are there extra fees?', content: 'No Vorell buyer fee. Your bank may charge wire/card fees, and international orders may incur duties/taxes payable to customs.' },
      { id: 'p-3', subject: 'Can I pay in installments?', content: 'We support split payments on a case-by-case basis and via partner providers in eligible regions.' },
      { id: 'p-4', subject: 'Is my payment secure?', content: 'Yes—TLS encryption, tokenized card storage via PCI-compliant processors, and fraud screening are enforced.' },
      { id: 'p-5', subject: 'Do you support escrow?', content: 'For certain high-value trades, we can arrange third-party escrow. Contact support for details.' },
      { id: 'p-6', subject: 'Can I use multiple payment methods?', content: 'Yes—contact support before checkout to split across methods (e.g., wire + card).' },
      { id: 'p-7', subject: 'When is my card charged?', content: 'Immediately upon order confirmation or when an offer is accepted.' },
      { id: 'p-8', subject: 'Can I get a VAT invoice?', content: 'Yes. Provide your business details at checkout and we’ll issue a compliant invoice where applicable.' },
      { id: 'p-9', subject: 'Currency and exchange rates', content: 'All prices default to USD. Your bank determines the final exchange rate if you pay in another currency.' },
      { id: 'p-10', subject: 'How fast do refunds post?', content: 'Card refunds typically settle in 3–7 business days; wires may take 1–3 business days after processing.' },
    ],

    warranty: [
      { id: 'wty-1', subject: 'What warranty do you provide?', content: 'Vorell provides a 12-month mechanical warranty on eligible watches (movement only). Manufacturer warranties are honored when valid.' },
      { id: 'wty-2', subject: 'What does the warranty cover?', content: 'Defects in movement or workmanship under normal use. It excludes water damage, accidental damage, misuse, theft, or cosmetic wear.' },
      { id: 'wty-3', subject: 'How do I request service?', content: 'Open a warranty ticket from Your Account → Orders. We’ll arrange insured shipping to our service center.' },
      { id: 'wty-4', subject: 'Do you guarantee accuracy?', content: 'Mechanical watches are regulated within manufacturer tolerances. COSC pieces aim for −4/+6s/day; vintage tolerances may be broader.' },
      { id: 'wty-5', subject: 'Will warranty work void water resistance?', content: 'After service we reseal and recommend a pressure test annually if you swim with the watch.' },
      { id: 'wty-6', subject: 'Are modifications covered?', content: 'Aftermarket parts or non-authorized modifications void the warranty.' },
      { id: 'wty-7', subject: 'Is strap/bracelet covered?', content: 'Straps/bracelets, crystals, and cosmetics are considered wear items and excluded unless received defective on arrival.' },
      { id: 'wty-8', subject: 'How long does service take?', content: 'Minor regulation: ~1–2 weeks. Full service/overhaul: 4–8 weeks depending on parts availability.' },
      { id: 'wty-9', subject: 'Can I choose my service center?', content: 'Warranty claims must go through Vorell to remain covered. Out-of-network work requires pre-approval.' },
      { id: 'wty-10', subject: 'Is water damage covered?', content: 'Water damage is not covered unless explicitly stated and verified as DOA upon delivery.' },
    ],

    returns: [
      { id: 'r-1', subject: 'What is your return policy?', content: 'Returns accepted within 7 days of delivery for eligible items. Items must be unworn, unaltered, with all stickers/tags and accessories.' },
      { id: 'r-2', subject: 'How do I start a return?', content: 'Start from Your Account → Orders → Request Return. We’ll send an insured label and packing instructions.' },
      { id: 'r-3', subject: 'Are returns free?', content: 'Return shipping/insurance may be deducted unless the return is due to our error (e.g., DOA, incorrect listing).' },
      { id: 'r-4', subject: 'When will I receive my refund?', content: 'After inspection (1–3 business days from receipt). Refunds go back to the original method of payment.' },
      { id: 'r-5', subject: 'Non-returnable items', content: 'Special orders, customized pieces, and certain vintage lots may be final sale—these are labeled on the listing.' },
      { id: 'r-6', subject: 'What if the watch arrives DOA?', content: 'Report within 72 hours with photos/video. We will prioritize repair, replacement, or full refund including shipping.' },
      { id: 'r-7', subject: 'Can I exchange for another model?', content: 'Yes, pending availability and inspection of the returned item. Any price difference will be settled accordingly.' },
      { id: 'r-8', subject: 'Security seals and stickers', content: 'Tampered/removed security seals void the return eligibility unless instructed by support.' },
      { id: 'r-9', subject: 'International returns', content: 'Mark as “Return of Goods” and include paperwork to avoid duplicate duties. Our team provides the forms.' },
      { id: 'r-10', subject: 'How are vintage discrepancies handled?', content: 'We disclose condition thoroughly; if a material discrepancy is found, contact us within 72 hours for resolution.' },
    ],

    community: [
      { id: 'c-1', subject: 'Can I post wrist shots and reviews?', content: 'Yes—share your experience respectfully. No personal info or pricing of other users without consent.' },
      { id: 'c-2', subject: 'Are sales allowed in community?', content: 'Sales are only permitted through official Vorell listings. Off-platform deals are not supported or protected.' },
      { id: 'c-3', subject: 'How do I report suspicious behavior?', content: 'Use the “Report” action or contact support with screenshots. We investigate promptly.' },
      { id: 'c-4', subject: 'Can I advertise services?', content: 'No advertising without written approval. Repeated promotion may result in account restrictions.' },
      { id: 'c-5', subject: 'What content is prohibited?', content: 'Counterfeits, hate speech, harassment, illegal activity, and doxxing are strictly forbidden.' },
      { id: 'c-6', subject: 'Account safety tips', content: 'Enable 2FA, use unique passwords, and never share payment or ID details publicly.' },
      { id: 'c-7', subject: 'Can I link my social profiles?', content: 'Yes, but external sales links are removed. Keep posts on-topic and helpful to other collectors.' },
      { id: 'c-8', subject: 'Moderator actions', content: 'Mods may remove content that violates guidelines and may restrict accounts for repeated offenses.' },
      { id: 'c-9', subject: 'Can I request feature updates?', content: 'Absolutely—post in Feedback with clear use cases. We track common requests.' },
      { id: 'c-10', subject: 'How do I get verified as a seller?', content: 'Apply through “Sell on Vorell”. We require ID + proof of inventory for store badges.' },
    ],

    other: [
      { id: 'o-1', subject: 'I want a model not listed—can you help?', content: 'Yes—use “Source a Watch”. We search our global network and notify you when a match is found.' },
      { id: 'o-2', subject: 'Do you offer gift packaging?', content: 'We can include a premium gift pouch and handwritten card. Add a note at checkout.' },
      { id: 'o-3', subject: 'Do you buy watches outright?', content: 'Yes. We purchase and consign. Send details (reference, photos, condition) for a quote.' },
      { id: 'o-4', subject: 'Corporate gifts or bulk orders', content: 'We support corporate gifting. Our team can curate models within your budget and timeline.' },
      { id: 'o-5', subject: 'Sustainability at Vorell', content: 'We prioritize recyclable packaging and partner with carbon-neutral couriers where available.' },
      { id: 'o-6', subject: 'Press & partnerships', content: 'Contact press@vorell.com for media inquiries and partnerships.' },
      { id: 'o-7', subject: 'Do you have a showroom?', content: 'Yes—private showroom visits by appointment. Photo ID required.' },
      { id: 'o-8', subject: 'Can I get a certificate of authenticity?', content: 'A Vorell Certificate of Authenticity is available on eligible pieces upon request.' },
      { id: 'o-9', subject: 'How do I contact support?', content: 'Email support@vorell.com or use live chat (9am–7pm local time, Mon–Sat).' },
      { id: 'o-10', subject: 'Site ownership & brand', content: 'Vorell is an independent luxury watch marketplace. We are not affiliated with Rolex, AP, Patek Philippe, or any manufacturer unless stated.' },
    ],
  };

  if (device === 'mobile') {
    return <div>Vorell FAQ (mobile)</div>;
  }

  return (
    <Stack className="faq-content">
      {/* Categories */}
      <Box className="categories" component="div">
        <div className={category === 'watches' ? 'active' : ''} onClick={() => changeCategoryHandler('watches')}>
          Watches
        </div>
        <div className={category === 'buyers' ? 'active' : ''} onClick={() => changeCategoryHandler('buyers')}>
          For Buyers
        </div>
        <div className={category === 'payment' ? 'active' : ''} onClick={() => changeCategoryHandler('payment')}>
          Payment
        </div>
        <div className={category === 'warranty' ? 'active' : ''} onClick={() => changeCategoryHandler('warranty')}>
          Warranty & Service
        </div>
        <div className={category === 'returns' ? 'active' : ''} onClick={() => changeCategoryHandler('returns')}>
          Shipping & Returns
        </div>
        <div className={category === 'community' ? 'active' : ''} onClick={() => changeCategoryHandler('community')}>
          Community
        </div>
        <div className={category === 'other' ? 'active' : ''} onClick={() => changeCategoryHandler('other')}>
          Other
        </div>
      </Box>

      {/* Panels */}
      <Box className="wrap" component="div">
        {data[category]?.map((item) => (
          <Accordion expanded={expanded === item.id} onChange={handleChange(item.id)} key={item.id}>
            <AccordionSummary id={`${item.id}-header`} className="question" aria-controls={`${item.id}-content`}>
              <Typography className="badge" variant="h4">
                Q
              </Typography>
              <Typography>{item.subject}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack className="answer flex-box">
                <Typography className="badge" variant="h4" color="primary">
                  A
                </Typography>
                <Typography>{item.content}</Typography>
              </Stack>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Stack>
  );
};

export default Faq;
