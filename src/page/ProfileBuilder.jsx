import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Box, MenuItem, Typography } from '@mui/material';
import {
  LoginBackground,
  LoginFormSection,
  NadiaPic,
  NameLabel,
} from '../components/styled/auth';
import { FlexBox, FlexBoxCenterColumn } from '../components/styled/general';
import { GeneralButton } from '../components/GeneralButton/GeneralButton';
import { GeneralSelect } from '../components/GeneralSelect/GeneralSelect';
import { GeneralTextField } from '../components/GeneralTextField/GeneralTextField';
import { useAuth } from '../contexts/AuthContext';
import { getDbUser, updateDbUser } from '../models/userModel';
import checkmark from './assets/checkmark.svg';

const ProfileBuilder = () => {
  // TODO: allow 'other' values
  const initialFormData = {
    age: '',
    gender: '',
    race: '',
    religion: '',
    housing: '',
    organisation: '',
  };
  const [formData, setFormData] = useState(initialFormData);
  const [activeStep, setActiveStep] = useState(0);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const getUserData = async () => {
    const dbUser = await getDbUser(currentUser.id);
    const { age, gender, race, religion, housing, organisation } = dbUser;
    formData.age = age || '';
    formData.gender = gender || '';
    formData.race = race || '';
    formData.religion = religion || '';
    formData.housing = housing || '';
    formData.organisation = organisation || '';
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

  const handleTextInput = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSave = async () => {
    const userProperties = {
      ...formData,
      isFacilitator: true,
    };
    await updateDbUser(currentUser.id, userProperties);
    navigate('/');
  };

  const options = {
    age: [
      { value: '', label: <em>None</em> },
      { value: '16', label: 'Under 16' },
      { value: '19', label: '16 to 19' },
      { value: '20', label: '20-29' },
      { value: '30', label: '30-39' },
      { value: '40', label: '40-49' },
      { value: '50', label: '50-59' },
      { value: '60', label: 'Above 60' },
    ],
    gender: [
      { value: '', label: <em>None</em> },
      { value: 'MALE', label: 'Male' },
      { value: 'FEMALE', label: 'Female' },
      { value: 'OTHER', label: 'Other' },
    ],
    race: [
      { value: '', label: <em>None</em> },
      { value: 'CHINESE', label: 'Chinese' },
      { value: 'MALAY', label: 'Malay' },
      { value: 'INDIAN', label: 'Indian' },
      { value: 'OTHER', label: 'Other' },
    ],
    religion: [
      { value: '', label: <em>None</em> },
      { value: 'CHRISTIAN', label: 'Christian' },
      { value: 'HINDU', label: 'Hindu' },
      { value: 'BUDDHIST', label: 'Buddhist' },
      { value: 'TAOIST', label: 'Taoist' },
      { value: 'MUSLIM', label: 'Muslim' },
      { value: 'SIKH', label: 'Sikh' },
      { value: 'FREE-THINKER', label: 'Free-Thinker' },
      { value: 'OTHER', label: 'Other' },
    ],
    housing: [
      { value: '', label: <em>None</em> },
      { value: 'HDB', label: 'HDB' },
      { value: 'CONDO', label: 'Condo' },
      { value: 'LANDED', label: 'Landed' },
      { value: 'OTHER', label: 'Other' },
    ],
  };

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
      title: 'Review your profile',
      text: [
        "Ok, so here's what I've got for your details. If you want to change something, you can rebuild your profile. If you're ready, let's get started!",
      ],
    },
  ];

  const step = steps[activeStep];

  const capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <LoginBackground>
      {step.isShowNadia ? <NadiaPic /> : null}
      {step.isShowNadia ? <NameLabel>Nadia</NameLabel> : null}

      <LoginFormSection isNadia={step.isShowNadia}>
        <Typography variant='h4' sx={{ mb: 2 }}>
          {step.title}
        </Typography>
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
          <Box sx={{ marginTop: '24px', width: '100%' }}>
            <GeneralSelect
              name='age'
              value={formData.age}
              onChange={handleChange}
              variant='filled'
              fullWidth
              label='How young are you?'
            >
              {options.age.map((option, index) => (
                <MenuItem key={index} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </GeneralSelect>
            <GeneralSelect
              name='gender'
              value={formData.gender}
              onChange={handleChange}
              variant='filled'
              fullWidth
              label='What gender do you identify as?'
            >
              {options.gender.map((option, index) => (
                <MenuItem key={index} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </GeneralSelect>
            <GeneralSelect
              name='race'
              value={formData.race}
              onChange={handleChange}
              variant='filled'
              fullWidth
              label='What ethnicity or racial group do you identify as?'
            >
              {options.race.map((option, index) => (
                <MenuItem key={index} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </GeneralSelect>
            <GeneralSelect
              name='religion'
              value={formData.religion}
              onChange={handleChange}
              variant='filled'
              fullWidth
              label='What is your religion?'
            >
              {options.religion.map((option, index) => (
                <MenuItem key={index} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </GeneralSelect>
            <GeneralSelect
              name='housing'
              value={formData.housing}
              onChange={handleChange}
              variant='filled'
              fullWidth
              label='What is your housing type?'
            >
              {options.housing.map((option, index) => (
                <MenuItem key={index} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </GeneralSelect>
            <GeneralTextField // TODO: change appearance of this text field
              name='organisation'
              value={formData.organisation}
              onChange={handleTextInput}
              label="What is your organisation's name?"
              placeholder=''
            />
          </Box>
        ) : null}

        {step.isFormReview ? (
          <Box sx={{ width: '100%' }}>
            {Object.keys(formData).map((key) => {
              const value = formData[key];
              const label =
                key === 'organisation'
                  ? value
                  : options[key].find((option) => option.value === value).label; // TODO: if we allow 'other' values, this will have to take directly from value if no match found
              return (
                <Typography key={key}>
                  {capitalize(key)}: {label}
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
          <FlexBoxCenterColumn>
            <GeneralButton
              variant='outlined'
              onClick={handleBack}
              style={{ marginTop: 16 }}
            >
              Rebuild my profile
            </GeneralButton>
            <GeneralButton
              variant='contained'
              onClick={handleSave}
              style={{ marginTop: 16 }}
            >
              Save and go to Facilitator Dashboard
            </GeneralButton>
          </FlexBoxCenterColumn>
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
