import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
  InputAdornment,
  IconButton,
  Modal,
} from '@mui/material';

import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLogin, setSocket } from 'state';
import Dropzone from 'react-dropzone';
import FlexBetween from 'components/FlexBetween';
import { toast } from 'react-toastify';

import { io } from 'socket.io-client';
import { RemoveRedEyeOutlined } from '@mui/icons-material';
const socket = io('http://localhost:3001');

const registerSchema = yup.object().shape({
  firstName: yup.string().required('required'),
  lastName: yup.string().required('required'),
  email: yup.string().email('invalid email').required('required'),
  password: yup.string().required('required'),
  location: yup.string().required('required'),
  occupation: yup.string().required('required'),
  picture: yup.string().required('required'),
});

const loginSchema = yup.object().shape({
  email: yup.string().email('invalid email').required('required'),
  password: yup.string().required('required'),
});

const initialValueRegister = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  location: '',
  occupation: '',
  picture: '',
};

const initialValueLogin = {
  email: '',
  password: '',
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  height: 300,
  bgcolor: '#27374D',
  border: '2px solid #000',
  boxShadow: 24,
  paddingTop: 5,
  paddingX: 2,
  paddingBottom: 3,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-arrow',
};

const Form = () => {
  const [pageType, setPageType] = useState('login');
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery('(min-width: 600px)');
  const isLogin = pageType === 'login';
  const isRegister = pageType === 'register';
  const [showPassword, setShowPassword] = useState(false);
  const [emailForgot, setEmailForgot] = useState();

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setEmailForgot('');
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const register = async (values, onSubmitProps) => {
    const formData = new FormData();
    for (let value in values) {
      formData.append(value, values[value]);
    }
    formData.append('picturePath', values.picture.name);

    const savedUserResponse = await fetch(
      'http://localhost:3001/auth/register',
      {
        method: 'POST',
        body: formData,
      }
    );

    const savedUser = await savedUserResponse.json();
    onSubmitProps.resetForm();

    if (savedUser.error) {
      setPageType('login');
      toast.error('🦄 Register Failed!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      return;
    }

    if (savedUser) {
      setPageType('login');
      toast.success('🦄 Register Success!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    }
  };

  const login = async (values, onSubmitProps) => {
    const loggedInResponse = await fetch('http://localhost:3001/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });

    const loggedIn = await loggedInResponse.json();
    onSubmitProps.resetForm();

    if (loggedIn.msg) {
      toast.error('🦄 Login Failed!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      return;
    }
    if (loggedIn) {
      dispatch(
        setLogin({
          user: loggedIn.user,
          token: loggedIn.token,
        })
      );

      socket.emit('join', loggedIn.user._id);

      navigate('/home');
      toast.success('🦄 Login Success!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    }
  };

  const forgot = async (e) => {
    e.preventDefault();

    if (!emailForgot) {
      return toast.error('Please enter an email');
    }

    const userData = {
      emailForgot,
    };

    setEmailForgot('');
    handleClose();
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) await register(values, onSubmitProps);
  };

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={isLogin ? initialValueLogin : initialValueRegister}
      validationSchema={isLogin ? loginSchema : registerSchema}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue,
        resetForm,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box
            display='grid'
            gap='30px'
            gridTemplateColumns='repeat(4, minmax(0, 1fr))'
            sx={{
              '& > div': {
                gridColumn: isNonMobile ? undefined : 'span 4',
              },
            }}
          >
            {isRegister && (
              <>
                <TextField
                  label='First Name'
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.firstName}
                  name='firstName'
                  error={
                    Boolean(touched.firstName) && Boolean(errors.firstName)
                  }
                  helperText={touched.firstName && errors.firstName}
                  sx={{ gridColumn: 'span 2' }}
                />
                <TextField
                  label='Last Name'
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.lastName}
                  name='lastName'
                  error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                  sx={{ gridColumn: 'span 2' }}
                />
                <TextField
                  label='Location'
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.location}
                  name='location'
                  error={Boolean(touched.location) && Boolean(errors.location)}
                  helperText={touched.location && errors.location}
                  sx={{ gridColumn: 'span 4' }}
                />
                <TextField
                  label='Occupation'
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.occupation}
                  name='occupation'
                  error={
                    Boolean(touched.occupation) && Boolean(errors.occupation)
                  }
                  helperText={touched.occupation && errors.occupation}
                  sx={{ gridColumn: 'span 4' }}
                />
                <Box
                  gridColumn='span 4'
                  border={`1px solid ${palette.neutral.medium}`}
                  borderRadius='5px'
                  p='1rem'
                >
                  <Dropzone
                    acceptedFiles='.jpg,.jpeg,.png'
                    multiple={false}
                    onDrop={(acceptedFiles) =>
                      setFieldValue('picture', acceptedFiles[0])
                    }
                  >
                    {({ getRootProps, getInputProps }) => (
                      <Box
                        {...getRootProps()}
                        border={`2px dashed ${palette.primary.main}`}
                        p='1rem'
                        sx={{ '&:hover': { cursor: 'pointer' } }}
                      >
                        <input {...getInputProps()} />
                        {!values.picture ? (
                          <p>Add Picture Here</p>
                        ) : (
                          <FlexBetween>
                            <Typography>{values.picture.name}</Typography>
                            <EditOutlinedIcon />
                          </FlexBetween>
                        )}
                      </Box>
                    )}
                  </Dropzone>
                </Box>
              </>
            )}

            <TextField
              label='Email'
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email}
              name='email'
              error={Boolean(touched.email) && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              sx={{ gridColumn: 'span 4' }}
            />
            <TextField
              label='Password'
              type={showPassword ? 'text' : 'password'}
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.password}
              name='password'
              error={Boolean(touched.password) && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              sx={{ gridColumn: 'span 4' }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    {showPassword ? (
                      <IconButton onClick={() => togglePassword()}>
                        <VisibilityOffOutlinedIcon />
                      </IconButton>
                    ) : (
                      <IconButton onClick={() => togglePassword()}>
                        <RemoveRedEyeOutlined />
                      </IconButton>
                    )}
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* BUTTON */}
          <Box>
            <Button
              fullWidth
              type='submit'
              sx={{
                m: '2rem 0',
                p: '1rem',
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                '&:hover': {
                  color: palette.primary.main,
                },
              }}
            >
              {isLogin ? 'LOGIN' : 'REGISTER'}
            </Button>
            {isLogin && (
              <Typography
                sx={{
                  textDecoration: 'underline',
                  color: palette.primary.main,
                  '&:hover': {
                    cursor: 'pointer',
                    color: '#F45050',
                  },
                  marginBottom: '0.7rem',
                }}
                onClick={handleOpen}
              >
                Forgot password
              </Typography>
            )}
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby='child-modal-title'
              aria-describedby='child-modal-description'
            >
              <Box sx={{ ...style, width: 400 }}>
                <form onSubmit={forgot}>
                  <Typography
                    variant='h2'
                    id='child-modal-title'
                    marginBottom={5}
                    color='#FFD95A'
                    textAlign={'center'}
                  >
                    Forgot Password
                  </Typography>

                  <TextField
                    label='Email Forgot'
                    onBlur={handleBlur}
                    onChange={(e) => setEmailForgot(e.target.value)}
                    value={emailForgot}
                    name='emailForgot'
                    sx={{ gridColumn: 'span 4', width: '100%' }}
                  />
                  <Button
                    fullWidth
                    type='submit'
                    sx={{
                      margin: '2rem 0',
                      padding: '1rem',
                      width: '100%',
                      backgroundColor: palette.primary.main,
                      color: palette.background.alt,
                      '&:hover': {
                        color: palette.primary.main,
                      },
                    }}
                  >
                    Send Email
                  </Button>
                </form>
              </Box>
            </Modal>
            <Typography
              onClick={() => {
                setPageType(isLogin ? 'register' : 'login');
                resetForm();
              }}
              sx={{
                textDecoration: 'underline',
                color: palette.primary.main,
                '&:hover': {
                  cursor: 'pointer',
                  color: '#F97B22',
                },
              }}
            >
              {isLogin
                ? "Don't have an account ? Sign Up here."
                : 'Already have an account ? Login here.'}
            </Typography>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default Form;
