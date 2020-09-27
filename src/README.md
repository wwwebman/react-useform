### Validation Playground

```jsx harmony
const { Container } = example;
import { useRef, useState } from 'react';
import {
  Input,
  useForm,
  Controller,
  Button,
  DebugForm,
  Selection,
  Row,
  Column,
} from '@pvg-react/common-ui';
import CancelCircle from '@pvg-react/common-ui/icons/CancelCircle';
import { debounce } from 'throttle-debounce';

const formRef = useRef(null);
const [nativeValidation, setNativeValidation] = useState(null);
const [validateOn, setValidateOn] = useState({
  submit: true,
  change: true,
  blur: false,
});
const {
  control,
  errors,
  handleSubmit,
  isSubmitting,
  validating,
  values,
  validationStatuses,
} = useForm({
  defaultValues: { name: '', age: '' },
  validateOn: Object.keys(validateOn).filter((v) => validateOn[v]),
  nativeValidation,
});

const wait = (time = 1000) =>
  new Promise((resolve) => {
    setTimeout(resolve, time);
  });

<>
  <form
    action="/"
    autoComplete="off"
    onSubmit={handleSubmit((result) => {
      console.log(JSON.stringify(result));
    })}
    ref={formRef}
  >
    <Container>
      <Controller
        name="age"
        control={control}
        rules={{
          required: { message: 'Required man!' },
          pattern: {
            message: 'Wrong format',
            value: /[0-9]/,
          },
          validate: {
            validator: () =>
              debounce(300, async (value) => {
                await wait(1500);

                return value === '18'
                  ? false
                  : `Tip: Type "18" istead of "${value}".`;
              }),
          },
        }}
      >
        {({ onChange, onBlur, name }) => (
          <>
            <Input
              error={Boolean(errors[name])}
              flyingPlaceholderText="Age"
              name={name}
              onBlur={onBlur}
              onChange={onChange}
              value={values.age}
            />
          </>
        )}
      </Controller>
      <Controller
        name="name"
        control={control}
        rules={{
          required: { message: 'Required man!' },
          maxLength: {
            message: 'Too long! Should be 2 chars max',
            value: 2,
          },
          pattern: {
            message: 'Wrong format',
            value: /[A-z]/,
          },
        }}
      >
        {({ onChange, onBlur, name }) => (
          <>
            <Input
              error={Boolean(errors[name])}
              flyingPlaceholderText="Name"
              name={name}
              onBlur={onBlur}
              onChange={onChange}
              value={values.name}
            />
          </>
        )}
      </Controller>
      <Button type="submit">{isSubmitting ? 'Loading...' : 'Submit'}</Button>
    </Container>
  </form>
  <Row space={5}>
    <Column>
      validateOn:
      {['submit', 'change', 'blur'].map((name) => (
        <Selection
          checked={validateOn[name]}
          key={name}
          label={name}
          name={name}
          onChange={() =>
            setValidateOn((state) => ({ ...state, [name]: !state[name] }))
          }
          type="checkbox"
        />
      ))}
    </Column>
    <Column>
      <Selection
        checked={Boolean(nativeValidation)}
        label="nativeValidation"
        name="nativeValidation"
        type="checkbox"
        onChange={() =>
          nativeValidation
            ? setNativeValidation(null)
            : setNativeValidation({ enable: true, formRef })
        }
      />
    </Column>
    <Column>
      <DebugForm
        errors={errors}
        values={values}
        validating={validating}
        validationStatuses={validationStatuses}
      />
    </Column>
  </Row>
</>;
```
