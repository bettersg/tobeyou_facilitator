import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Box, MenuItem, TextField, Typography } from '@mui/material';
import {
  LoginBackground,
  LoginFormSection,
  NadiaPic,
  NameLabel,
} from '../styled/auth';
import { GeneralButton, FlexBox } from '../styled/general';
import { useAuth } from '../../contexts/AuthContext';
import { getDbUser, updateDbUser } from '../../models/userModel';
import checkmark from './assets/checkmark.svg';

const ProfileBuilder = () => {
  // TODO: allow 'other' values
  const initialFormData = {
    age: '',
    gender: '',
    race: '',
    religion: '',
    housing: '',
  };
  const [formData, setFormData] = useState(initialFormData);
  const [activeStep, setActiveStep] = useState(0);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const getUserData = async () => {
    const dbUser = await getDbUser(currentUser.id);
    const { age, gender, race, religion, housing } = dbUser;
    formData.age = age || '';
    formData.gender = gender || '';
    formData.race = race || '';
    formData.religion = religion || '';
    formData.housing = housing || '';
  };

  useEffect(() => getUserData(), []);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value.trim(),
    });
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSave = async () => {
    await updateDbUser(currentUser.id, formData);
    navigate('/');
  };

  const ageOptions = [
    { value: '', label: <em>None</em> },
    { value: '16', label: 'Under 16' },
    { value: '19', label: '16 to 19' },
    { value: '20', label: '20-29' },
    { value: '30', label: '30-39' },
    { value: '40', label: '40-49' },
    { value: '50', label: '50-59' },
    { value: '60', label: 'Above 60' },
  ];

  const genderOptions = [
    { value: '', label: <em>None</em> },
    { value: 'MALE', label: 'Male' },
    { value: 'FEMALE', label: 'Female' },
    { value: 'OTHER', label: 'Other' },
  ];

  const raceOptions = [
    { value: '', label: <em>None</em> },
    { value: 'CHINESE', label: 'Chinese' },
    { value: 'MALAY', label: 'Malay' },
    { value: 'INDIAN', label: 'Indian' },
    { value: 'OTHER', label: 'Other' },
  ];

  const religionOptions = [
    { value: '', label: <em>None</em> },
    { value: 'CHRISTIAN', label: 'Christian' },
    { value: 'HINDU', label: 'Hindu' },
    { value: 'BUDDHIST', label: 'Buddhist' },
    { value: 'TAOIST', label: 'Taoist' },
    { value: 'MUSLIM', label: 'Muslim' },
    { value: 'SIKH', label: 'Sikh' },
    { value: 'FREE-THINKER', label: 'Free-Thinker' },
    { value: 'OTHER', label: 'Other' },
  ];

  const housingOptions = [
    { value: '', label: <em>None</em> },
    { value: 'HDB', label: 'HDB' },
    { value: 'CONDO', label: 'Condo' },
    { value: 'LANDED', label: 'Landed' },
    { value: 'OTHER', label: 'Other' },
  ];

  const steps = [
    {
      isShowNadia: true,
      isForm: false,
      text: [
        "Heya, thanks for being curious about what it's like to be me. It's a pretty simple game. Your participants will play as me (and other characters), be able to hear our thoughts, and make choices that have consequences.",
      ],
    },
    {
      isShowNadia: true,
      isForm: false,
      text: ["Through this facilitator dashboard, you'll be able to:"],
      check: [
        'Choose characters and chapters that you want your participants to focus on',
        "Track participants' game progress",
        "Analyze participants' gameplay statistics to help bolster your discussions",
      ],
    },
    {
      isShowNadia: true,
      isForm: false,
      text: [
        'You can also try the game out yourself! Using this same account, you can play the game and get a better understanding of what your participants will experience.',
        'This account will be used to save your personal game progress, analyse trends, and share interesting insights. Your data will be anonymised so it will never be used to identify you.',
      ],
    },
    {
      isShowNadia: false,
      isForm: true,
      text: [
        "I'll need to understand you better by asking a couple of questions. We only use the data to make the game more relevant to you, and we will not share the data with anybody.",
        "If you're not comfortable answering any of these questions, feel free to leave it blank.",
      ],
    },
    {
      isShowNadia: false,
      isFormReview: true,
      text: [
        "Ok, so here's what I've got for your details. If you want to change something, you can rebuild your profile. If you're ready, let's get started!",
      ],
    },
  ];

  const step = steps[activeStep];

  return (
    <LoginBackground>
      {step.isShowNadia ? <NadiaPic /> : null}
      {step.isShowNadia ? <NameLabel>Nadia</NameLabel> : null}

      <LoginFormSection isNadia={step.isShowNadia}>
        {/* <Typography>(Nadia picture)</Typography> */}
        {step.text.map((paragraph, i) => (
          <Typography key={i} sx={{ marginBottom: '8px' }}>
            {paragraph}
          </Typography>
        ))}
        {step.check
          ? step.check.map((paragraph, i) => (
              <FlexBox key={i} sx={{ width: '100%', marginBottom: '8px' }}>
                <img src={checkmark} style={{ marginRight: '8px' }} />
                <Typography>{paragraph}</Typography>
              </FlexBox>
            ))
          : null}
        {step.isForm ? (
          <Box>
            <Typography>How young are you?</Typography>
            <TextField
              select
              name='age'
              value={formData.age}
              onChange={handleChange}
            >
              {ageOptions.map((option, index) => (
                <MenuItem key={index} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <Typography>What gender do you identify as?</Typography>
            <TextField
              select
              name='gender'
              value={formData.gender}
              onChange={handleChange}
            >
              {genderOptions.map((option, index) => (
                <MenuItem key={index} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <Typography>
              What ethnicity or racial group do you identify as?
            </Typography>
            <TextField
              select
              name='race'
              value={formData.race}
              onChange={handleChange}
            >
              {raceOptions.map((option, index) => (
                <MenuItem key={index} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <Typography>What is your religion?</Typography>
            <TextField
              select
              name='religion'
              value={formData.religion}
              onChange={handleChange}
            >
              {religionOptions.map((option, index) => (
                <MenuItem key={index} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <Typography>What is your housing type?</Typography>
            <TextField
              select
              name='housing'
              value={formData.housing}
              onChange={handleChange}
            >
              {housingOptions.map((option, index) => (
                <MenuItem key={index} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        ) : null}
        {step.isFormReview ? (
          <Box>
            {Object.keys(formData).map((key) => {
              const value = formData[key];
              return (
                <Typography key={key}>
                  {key}: {value}
                </Typography>
              );
            })}
          </Box>
        ) : null}
        {!step.isFormReview ? (
          <GeneralButton
            variant='contained'
            onClick={handleNext}
            style={{ marginTop: 16, width: '190px' }}
          >
            Next
          </GeneralButton>
        ) : (
          <Box>
            <GeneralButton
              variant='contained'
              onClick={handleBack}
              style={{ marginTop: 16, width: '190px' }}
            >
              Rebuild my profile
            </GeneralButton>
            <GeneralButton
              variant='contained'
              onClick={handleSave}
              style={{ marginTop: 16, width: '190px' }}
            >
              Save and go to Facilitator Dashboard
            </GeneralButton>
          </Box>
        )}
      </LoginFormSection>
      <img
        src='/login_signup/logo.png'
        width='200'
        style={{ position: 'absolute', top: 10, left: 20 }}
      />
      <img
        src='/login_signup/characters.png'
        width='400'
        style={{ position: 'absolute', bottom: 0, right: 0 }}
      />
    </LoginBackground>
  );
};

export default ProfileBuilder;
