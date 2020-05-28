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

import React, { useContext, Component } from "react"
import {Banner, Box, Heading, Paragraph, Popover, PopoverContent, Text, Button, Icon, ButtonOutline, Space} from '@looker/components'
import {
  ExtensionContext,
  ExtensionContextData,
  getCore31SDK,
  getCore40SDK
} from "@looker/extension-sdk-react"
import {ILook} from '@looker/sdk'
import {Switch, Route, RouteComponentProps, withRouter, MemoryRouter} from 'react-router-dom'
import { hot } from "react-hot-loader/root"
import Experience from "./Experience"
import styled from 'styled-components';
import { promises } from 'fs'
import { List } from 'lodash'

interface ExtensionState {
  loadingBoards: boolean
  errorMessage?: string
  boardIds: Array<string>
}


class ExtensionInternal extends Component<RouteComponentProps, ExtensionState> {
  static contextType = ExtensionContext;
  context!: React.ContextType<typeof ExtensionContext>;
  // static extensionContext = useContext<ExtensionContextData>(ExtensionContext);
  //sdk = this.context.core31SDK;

  constructor(props: RouteComponentProps) {
    super(props)
    this.state = {
      loadingBoards: true,
      boardIds: []
    }
  }

  UpdateBoards(look_id: any) {
    console.log('Running look')
    console.log(look_id)
    this.context.core31SDK.run_look({'look_id':look_id, 'result_format':'json'}).then(
        (result: any) => {
            var new_board_ids = [];
            if (result.ok) {
                for(var i = 0; i < result.value.length; i++){ 
                    new_board_ids.push(result.value[i]['demo_use_cases.trial_board']);
                }
              } 
            else {
                console.error("Something went wrong:", result.error)
            }
            this.setState({boardIds : new_board_ids})
        }
      )
    };

    componentWillMount() {
      this.UpdateBoards(79);
      // this.setState({boardIds : boards});
  }


  render() {
    if (this.context.initializeError) {
      return <Banner intent='error'>{this.context.initializeError}</Banner>
    }
    for (var i = 0; i < this.state.boardIds.length; i++) {
      var elements=[];
      var string_length = 'https://trial.looker.com/boards/'.length;
      var b_id = parseInt(this.state.boardIds[i].substr(string_length),10);
      //console.log(b_id)
      elements.push(<Experience key={i} board_id={b_id}/>);}
    return (
      <>
        {this.state.errorMessage && <Banner intent='error'>{this.state.errorMessage}</Banner>}
        <Box m='large' marginTop='80'>
          <Box  display="flex" flexWrap='wrap'>
          <Box m='medium' width={'35%'} marginLeft='100' marginRight='100'>
            <Heading fontWeight='semiBold' marginBottom='10'>Welcome to your Looker Trial!</Heading>
            <Paragraph fontSize='medium'> We've created this instance so you can better understand how Looker will help you use data to drive real business value. 
              Here, you will be able to walk through a series of guided data experiences that we've developed based on common use cases we see from our customers. 
            </Paragraph>
          </Box>
          <Box width="40%" marginTop="20" marginBottom="10" marginRight="10%" alignItems="center">
            <Banner intent="info" fontSize="xsmall"> Click on a button to see what assets are in each section, then jump into a use case to get started!
            </Banner>
            <Space>
            <Box display="flex" flexWrap='wrap' paddingLeft="10">
              <Popover
              content={
              <PopoverContent p="large" width="360px">
                <Text fontSize="small" textAlign="center">Start your Looker journey by opening both a Dashboard and the corresponding Dashboard Guide, which will walk you through step-by-step instructions for getting started using dashboards in Looker.</Text>
              </PopoverContent>}>
                  {(onClick, ref, className) => (
                      <ButtonOutline width="100%" color="neutral" iconBefore="Visualization" marginBottom="10" aria-haspopup="true" onClick={onClick} ref={ref} className={className}>Go to Dashboards</ButtonOutline>)}
            </Popover>            
          </Box>
            <Box>
            <Popover
              content={
              <PopoverContent p="large" width="360px">
                  <Paragraph fontSize="small" textAlign="center">Ready to learn how to ask new question of the data? Jump into an Explore and follow along with the Q & A Packet to get familiar with exploring data in Looker.</Paragraph>
              </PopoverContent>}>
                  {(onClick, ref, className) => (
                      <ButtonOutline width="100%" color="neutral" iconBefore="Explore" marginBottom="10" aria-haspopup="true" onClick={onClick} ref={ref} className={className}>Start Exploring</ButtonOutline>)}
              </Popover>   
              </Box>
            <Box>
            <Popover
              content={
              <PopoverContent p="large" width="360px">
                <Paragraph fontSize="small" textAlign="center">Check out the additional resources menu for links to supporting material such as customer stories or recorded videos specific to the industry or use case</Paragraph>
              </PopoverContent>}>
                  {(onClick, ref, className) => (
                      <ButtonOutline width="100%" color="neutral" iconBefore="Public" marginBottom="10" aria-haspopup="true" onClick={onClick} ref={ref} className={className}>Additional Resources</ButtonOutline>)}
              </Popover>  
            </Box>
            </Space>
          </Box>
          </Box>
          {/* <Heading marginTop='50'> Click on an experience below to get started 🤩</Heading> */}
          <Box m='large' display='flex' flexWrap='wrap'>
          {elements}
          </Box>
        </Box>



      </>
    )
  }
}

export const Extension = hot(withRouter(ExtensionInternal))

//   const dashboard_icon = (
    //     <Icon name="Visualization" color="palette.purple300" size={24} marginRight="small" />
    //   )
    //   const explore_icon = (
    //     <Icon name="Explore" color="palette.purple300" size={24} marginRight="small" />
    //   )
    //   const ditl_icon = (
    //     <Icon name="ExploreOutline" color="palette.purple300" size={24} marginRight="small" />
    //   )
    //   const ex_packet_icon = (
    //     <Icon name="FormatListNumbered" color="palette.purple300" size={24} marginRight="small" />
    //   )
    //   const customer_stories_icon = (
    //     <Icon name="Account" color="palette.purple300" size={24} marginRight="small" />
    //   )
    //   const see_recording_icon = (
    //     <Icon name="Public" color="palette.purple300" size={20} marginRight="small" />
    //   )
{/* <Popover
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
          </Popover> */}
