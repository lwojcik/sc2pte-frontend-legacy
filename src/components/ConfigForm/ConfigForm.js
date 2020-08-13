import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Button } from 'reactstrap';
import {
  Form,
  Text,
} from 'informed';

import Phrases from '../../constants/phrases';

import ConfigFormGroup from '../ConfigFormGroup/ConfigFormGroup';
import ConfigFormLabel from '../ConfigFormLabel/ConfigFormLabel';
import ConfigFormError from '../ConfigFormError/ConfigFormError';
import ConfigFormSubmitWrapper from '../ConfigFormSubmitWrapper/ConfigFormSubmitWrapper';

import { validateProfileUrl } from '../../helpers/config';

import './ConfigForm.css';


/* eslint-disable arrow-body-style */

const validateFieldLength = (value, number) => {
  return (!typeof value == null && value.length > number)
    ? Phrases.en.config.validation.valueTooLong
    : null;
};

const validateFieldNotEmpty = (value) => {
  return (!value && value == null)
    ? Phrases.en.config.validation.fieldCannotBeEmpty
    : null;
};

const validateBnetProfileUrl = (profileUrl) => {
  return !validateProfileUrl(profileUrl) === true
    ? Phrases.en.config.validation.urlLooksInvalid
    : null;
};

const validateProfileUrlField = (value) => {
  return (validateFieldNotEmpty(value)
  || validateFieldLength(value, 80)
  || validateBnetProfileUrl(value));
};

/* eslint-enable arrow-body-style */

const cx = errorObject => classnames('form-control', errorObject ? 'is-invalid' : '');

const ConfigForm = ({
  phrases, // eslint-disable-line react/prop-types
  onSubmit,
  submissionDisabled,
  profileUrl,
}) => (
  <Form className="ConfigForm" id="ConfigForm" onSubmit={onSubmit}>
    {({ formState }) => (
      <React.Fragment>
        <ConfigFormGroup>
          <ConfigFormLabel text={phrases.fields.profileUrl.label} fieldName="profileUrl" />
          <Text
            placeholder={profileUrl}
            className={cx(formState.errors.profileUrl)}
            field="profileUrl"
            id="profileUrl"
            validateOnBlur
            validateOnChange
            validate={validateProfileUrlField}
            maxLength="80"
          />
          <ConfigFormError>
            {formState.errors.profileUrl}
          </ConfigFormError>
        </ConfigFormGroup>
        <ConfigFormSubmitWrapper>
          <Button color="primary" disabled={submissionDisabled || formState.invalid || formState.pristine}>
            {phrases.fields.submit.label}
          </Button>
        </ConfigFormSubmitWrapper>
      </React.Fragment>
    )}
  </Form>
);

ConfigForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  submissionDisabled: PropTypes.bool,
  profileUrl: PropTypes.string,
};

ConfigForm.defaultProps = {
  submissionDisabled: true,
  profileUrl: '',
};

export default ConfigForm;
