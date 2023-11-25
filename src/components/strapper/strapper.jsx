import * as React from 'react';
import PropTypes from 'prop-types';

import Step from '@mui/material/Step';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, Stepper } from '@mui/material';

const steps = ['Select recipient', 'Select the file', 'Send Transaction'];

export default function HorizontalLinearStepper({ id: ids, selected, handleIsValidStep2, handleIsValidStep3, fileSelected }) {
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const [openAlert, setOpenAlert] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState('');
  const isStepOptional = (step) => step === -1;

  const isStepSkipped = (step) => skipped.has(step);

  const handleNext = () => {
    console.log(activeStep)
    let newSkipped = skipped;
    if (ids.length > 1) {
      setOpenAlert(true);
      setAlertMessage("For the moment, just allow select one recipient per transaction.");
      return
    }
    if (ids.length === 0 || ids === undefined) {
      setOpenAlert(true);
      setAlertMessage("You must select a recipient.");
    } else if (activeStep === 0) {
      handleIsValidStep2(true);
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setSkipped(newSkipped);
    }
    else if (activeStep === 1 && !fileSelected) {
      setOpenAlert(true);
      setAlertMessage("You must select a file.");
    }
    else {
      handleIsValidStep2(false); // false
      handleIsValidStep3(true); // true
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setSkipped(newSkipped);
    }
  };

  const handleBack = () => {
    if (activeStep === 2) {
      handleIsValidStep3(false);
      handleIsValidStep2(true)
    }
    if (activeStep === 1) {
      handleIsValidStep2(false);
      handleIsValidStep3(false);
    }
    setActiveStep((prevActiveStep) => prevActiveStep - 1);

  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    handleIsValidStep2(false)
    handleIsValidStep3(false)
    setActiveStep(0);
  };

  return (
    <><Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          if (isStepOptional(index)) {
            labelProps.optional = (
              <Typography variant="caption">Optional</Typography>
            );
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you&apos;re finished
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleReset}>Send other transaction</Button>
          </Box>
        </>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
          <Button
            color="inherit"
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />
          {isStepOptional(activeStep) && (
            <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
              Skip
            </Button>
          )}

          <Button onClick={handleNext}>
            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </Box>
      )}
    </Box><Box sx={{ width: '100%' }}>
        <Collapse in={openAlert}>
          <Alert
            severity="warning"
            action={<IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpenAlert(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>}
            sx={{ mb: 2 }}
          >
            {alertMessage}
          </Alert>
        </Collapse>
      </Box></>
  );
}

HorizontalLinearStepper.propTypes = {
  id: PropTypes.array,
  selected: PropTypes.bool,
  fileSelected: PropTypes.bool,
  handleIsValidStep2: PropTypes.func,
  handleIsValidStep3: PropTypes.func
}