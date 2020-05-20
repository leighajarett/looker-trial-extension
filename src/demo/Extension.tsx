/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019 Looker Data Sciences, Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import React from 'react'
import {Banner, Box, Heading, Paragraph, Popover, PopoverContent, Text} from '@looker/components'
import {ExtensionContext} from '@looker/extension-sdk-react'
import {ILook} from '@looker/sdk'
import {Switch, Route, RouteComponentProps, withRouter, MemoryRouter} from 'react-router-dom'
import { hot } from "react-hot-loader/root"
import Experience from "./Experience"

interface ExtensionState {
  // looks?: ILook[]
  // currentLook?: ILook
  // selectedLookId?: number
  // queryResult?: any
  // runningQuery: boolean
  loadingLooks: boolean
  errorMessage?: string
}

class ExtensionInternal extends React.Component<RouteComponentProps, ExtensionState> {
  static contextType = ExtensionContext
  context!: React.ContextType<typeof ExtensionContext>

  constructor(props: RouteComponentProps) {
    super(props)
    this.state = {
      loadingLooks: false
    }
  }

  render() {
    if (this.context.initializeError) {
      return <Banner intent='error'>{this.context.initializeError}</Banner>
    }
    return (
      <>
        {this.state.errorMessage && <Banner intent='error'>{this.state.errorMessage}</Banner>}
        <Box m='large' marginTop='80'>
          <Box m='medium' width={'40%'} marginLeft='75'>
            <Heading fontWeight='semiBold' marginBottom='10'>Welcome to the Looker Sandbox Trial Instance!</Heading>
            <Paragraph fontSize='medium'> We've created this instance to help you understand how Looker may help you use data to drive real business value. 
              Here, you will be able to walk through a series of guided data experiences that we've developed based on common use cases we see from our customers. 
            </Paragraph>
          </Box>
          <Box>
          <Popover
            content={
              <PopoverContent p="large" width="360px">
                <Heading>Wildebeest</Heading>

                <Text fontSize="small">
                  The blue wildebeest, also called the common wildebeest, white-bearded
                  wildebeest or brindled gnu, is a large antelope and one of the two
                  species of wildebeest. It is placed in the genus Connochaetes and family
                  Bovidae and has a close taxonomic relationship with the black
                  wildebeest. The blue wildebeest is known to have five subspecies. This
                  broad-shouldered antelope has a muscular, front-heavy appearance, with a
                  distinctive robust muzzle. Young blue wildebeest are born tawny brown,
                  and begin to take on their adult colouration at the age of two months.
                  The adults' hues range from a deep slate or bluish gray to light gray or
                  even grayish brown. Both sexes possess a pair of large curved horns.
                </Text>
              </PopoverContent>
            }
          >
            {(onClick, ref, className) => (
              <Button
                aria-haspopup="true"
                onClick={onClick}
                ref={ref}
                className={className}
              >
                A Wikipedia article about Wildebeests
              </Button>
            )}
          </Popover>
          </Box>
          {/* <Heading marginTop='50'> Click on an experience below to get started 🤩</Heading> */}
          <Box m='large' display='flex' flexWrap='wrap'>
            <Experience board_id={26}/>
            <Experience board_id={25}/>
            <Experience board_id={26}/>
          </Box>
        </Box>



      </>
    )
  }
}

export const Extension = hot(withRouter(ExtensionInternal))
