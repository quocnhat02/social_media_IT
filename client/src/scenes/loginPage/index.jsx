import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import Form from './Form';

const LoginPage = () => {
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery('(min-width: 1000px)');

  return (
    <Box>
      <Box
        width='100%'
        backgroundColor={theme.palette.background.alt}
        p='1rem 6%'
        textAlign='center'
      >
        <Typography
          fontWeight='bold'
          fontSize='32px'
          sx={{
            background:
              'linear-gradient(90deg, rgba(228,189,87,1) 6%, rgba(64,233,108,1) 28%, rgba(64,225,204,1) 50%, rgba(238,106,211,1) 71%,  rgba(241,67,67,1) 91%);',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          SocialMediaIT
        </Typography>
      </Box>

      <Box
        width={isNonMobileScreens ? '50%' : '93%'}
        p='2rem'
        m='2rem auto'
        textAlign='center'
        borderRadius='1.5rem'
        backgroundColor={theme.palette.background.alt}
        // backgroundColor={theme.palette.grey[200]}
      >
        <Typography fontWeight='500' variant='h5' sx={{ mb: '1.5rem' }}>
          Welcome to SocialMediaIT
        </Typography>
        <Form></Form>
      </Box>
    </Box>
  );
};

export default LoginPage;
