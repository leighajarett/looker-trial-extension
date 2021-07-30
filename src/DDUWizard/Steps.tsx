import React from 'react'
import {
  Grid,
  FlexItem,
  Flex,
  Divider,
  Box,
  Button,
  ButtonOutline,
  Icon,
  Heading,
  Paragraph,
  Link,
  Checkbox
} from '@looker/components'
import { Done } from '@styled-icons/material/Done'
import {useLookerRedirect} from './hooks/useLookerRedirect'
import {useExtensionDetector} from './ExtensionDetector'

type StepsProps = {
  close: () => void
}

const Steps: React.FC<StepsProps> = ({ children, close }) => {
  const [current, setCurrent] = React.useState(0)
  const [checked, setChecked] = React.useState(false)

  const detected = useExtensionDetector()
  const redirect = useLookerRedirect()

  const handleRedirect = () => {
    redirect('https://datadriven.university/privacy', 'blank')
  }

  const downloadExtension = () => {
    redirect(
        'https://chrome.google.com/webstore/detail/data-driven-university/ckfldhejolipdmhhmofaandhaimbcbdn',
        '_blank'
    )
  }

  const steps = [
    {
      content: <Box margin="25px 0">
        <Heading textAlign="center" marginBottom="15px" as="h2">We value your privacy!</Heading>
        <Paragraph>We and our partners use technology such as cookies on our site to
          personalise content and analyse our traffic.</Paragraph>
        <Paragraph>Click below to consent to the use of this technology across the
          web. You can change your mind and change your consent choices at
          anytime be returning to this site.</Paragraph>
        <Paragraph>Check our <Link href="https://datadriven.university/privacy">Privacy Policy</Link> to see what data we are collecting.</Paragraph>
        <Flex marginTop="25px">
          <Checkbox checked={checked} onChange={() => setChecked(!checked)} />
          <Box marginLeft="5px">I agree to Privacy Policy</Box>
        </Flex>
      </Box>,
    },
    {
      content: <Box textAlign="center" margin="25px 0">
        <Heading marginBottom="15px" as="h2">To get the most out of DDU, install our extension!</Heading>
        <Button size="large" onClick={downloadExtension}>
          Download
        </Button>
      </Box>,
    },
    {
      content: <Box textAlign="center" margin="25px 0">
        <Heading marginBottom="15px" as="h1">Thank you!</Heading>
      </Box>,
    },
  ]

  const next = () => {
    setCurrent(current + 1)
  }

  const prev = () => {
    setCurrent(current - 1)
  }

  const nextButtonDisabled = (current === 0 && !checked) || (current === 1 && !detected)

  return (
    <Grid columns={1}>
      <Flex alignItems="center">
        {steps.map((_, index) => {
          const active = index === current
          const done = index < current
          return (
            <React.Fragment key={index}>
              <FlexItem>
                <Flex
                  width="50px"
                  height="50px"
                  bg={done ? 'key' : 'ui1'}
                  borderRadius="50%"
                  color={active ? 'key' : done ? 'inverseOn' : 'inverse'}
                  alignItems="center"
                  justifyContent="center"
                  border={`2px solid ${active || done ? '#6C43E0' : '#F5F6F7'}`}
                  p="medium"
                >
                  <Box userSelect="none">{done ? <Icon icon={<Done />} /> : index + 1}</Box>
                </Flex>
              </FlexItem>
              {index !== steps.length - 1 && (
                <FlexItem flex={1}>
                  <Divider
                    size="2px"
                    customColor={done ? 'key' : '#F5F6F7'}
                  />
                </FlexItem>
              )}
            </React.Fragment>
          )
        })}
      </Flex>
      <Box>{steps[current].content}</Box>
      <Flex justifyContent="flex-end">
        {current > 0 && (
          <FlexItem margin="0 5px">
            <ButtonOutline minWidth="110px" onClick={() => prev()}>
              Previous
            </ButtonOutline>
          </FlexItem>
        )}
        {current < steps.length - 1 && (
          <FlexItem>
            <Button disabled={nextButtonDisabled} minWidth="110px" onClick={() => next()}>
              Next
            </Button>
          </FlexItem>
        )}
        {current === steps.length - 1 && (
          <FlexItem>
            <Button minWidth="110px" onClick={() => close()}>
              Done
            </Button>
          </FlexItem>
        )}
      </Flex>
    </Grid>
  )
}

export default Steps
