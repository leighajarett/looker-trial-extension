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

import React, { useContext, Component, useEffect } from "react"
import {Banner, Box, Heading, Paragraph, Popover, PopoverContent, Text, Button, Icon, ButtonOutline, Space, Menu, MenuDisclosure, MenuList, MenuItem} from '@looker/components'
import {
  ExtensionContext,
  ExtensionContextData,
  getCore31SDK,
  getCore40SDK
} from "@looker/extension-sdk-react"
import {ILook} from '@looker/sdk'
import {Switch, Route, RouteComponentProps, withRouter, MemoryRouter} from 'react-router-dom'
import { hot } from "react-hot-loader/root"
import Experience from "./Experience";
import ExperienceMenuButton from "./Experience";
import styled from 'styled-components';
import { promises } from 'fs'


export default function Extension(){
  const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
  const sdk = extensionContext.core31SDK
  var [boardIds, setBoards] = React.useState([] as any)
  var inital_meta: { [key: string]: any } = {};
  var [metadata, setMetaData] = React.useState(inital_meta)
  var [isDeveloper, setDeveloper] = React.useState(false as boolean)

  const updateBoards = () => {
    // update the state with the list of boards from our demo board list
    sdk.run_look({'look_id':79, 'result_format':'json', 'cache':true}).then(
      (result: any) => {
        var new_board_ids = [];
        if (result.ok) {
          for(var i = 0; i < result.value.length; i++){ 
              var b_id = parseInt(result.value[i]['demo_use_cases.trial_board_id']);
              new_board_ids.push(b_id);
          }
          setBoards(new_board_ids);
        } 
      }
    )
  };

  const updateMetaData = () => {
    // update the state with the list of boards from our demo board list
    sdk.run_look({'look_id':77, 'result_format':'json', 'cache':true}).then(
      (result: any) => {
        if (result.ok) {
          var new_board: {[b_id: string]: any} = {};
          for(var i = 0; i < result.value.length; i++){ 
            // index by the board & section id
            var b_id: string;
            var s_id: string;

            b_id = result.value[i]['demo_use_cases.trial_board_id'];
            s_id = result.value[i]['demo_use_cases.section_id'];
            if (!new_board[b_id]){new_board[b_id] = {}};
            new_board[b_id][s_id] = {
              customer_story: result.value[i]['demo_use_cases.customer_story'],
              day_in_the_life: result.value[i]['demo_use_cases.day_in_the_life'], 
              explore_packet: result.value[i]['demo_use_cases.explore_packet_embed_url'], 
              explore_start: result.value[i]['demo_use_cases.explore_start'], 
              dashboard_start: result.value[i]['demo_use_cases.dashboard_start_slug'], 
              recorded_demo: result.value[i]['demo_use_cases.embed_demo_url'], 
              section_id: result.value[i]['demo_use_cases.section_id'], 
              trial_board: result.value[i]['demo_use_cases.trial_board'],
              vertical: result.value[i]['demo_use_cases.vertical']
          };
          }
          setMetaData(new_board);
        } 
        else {
          console.error("Something went wrong with getting the metadata", result.error)
        }
      }
    )
  };

  const getModels = () => {
    // update the state with the list of boards from our demo board list
    sdk.all_lookml_models().then(
      (result: any) => {
        if (result.ok) {
          for(var i = 0; i < result.value.length; i++){
            if(result.value[i].name == "getting_started_with_lookml"){
              setDeveloper(true);
            }
          }
        } 
      }
    )
  };

  useEffect(() => {
      updateBoards();
      updateMetaData();
      getModels();
  }, []);

  return (
  <>
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
            <Text fontSize="small" textAlign="center">Start your Looker journey by a opening up a Dashboard, or going to the Board - which has all the Dashboards for the industry pinned for easy access</Text>
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
          <DevelopButton developer={isDeveloper}></DevelopButton>
        </Box>
        </Space>
      </Box>
      </Box>
      {/* <Heading marginTop='50'> Click on an experience below to get started 🤩</Heading> */}
      <Box m='large' display='flex' flexWrap='wrap'>
        {
          boardIds.map((item: any, i: number) => 
            (<Experience key={i} board_id={item} board_metadata={metadata}></Experience>)
          )
        }
      </Box>
      </Box>
  </>
)
}


export function DevelopButton(props:any){
  const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
  const sdk = extensionContext.extensionSDK
  var [show, setShow] = React.useState(false)

  if(props.developer){
    return(
      <Menu>
      <MenuDisclosure>
        <ButtonOutline width="100%" color="neutral" iconBefore="Code" marginBottom="10" aria-haspopup="true">Begin Developing</ButtonOutline>
      </MenuDisclosure>
      <MenuList>
        <MenuItem key={0} itemRole="button" onClick={() =>  sdk.openBrowserWindow('/projects/getting_started_with_lookml/','_blank')}>Learn LookML</MenuItem>
        <MenuItem key={1} itemRole="button" onClick={() =>  sdk.openBrowserWindow('/projects/lookml_from_scratch','_blank')}>Practice LookML from Scratch</MenuItem>
      </MenuList>
    </Menu>
    )
  }
  else{
    return(
      <Popover
        content={
        <PopoverContent p="large" width="360px">
              <Paragraph fontSize="small" textAlign="center">Check out the additional resources menu for links to supporting material such as customer stories or recorded videos specific to the industry or use case</Paragraph>
        </PopoverContent>}>
            {(onClick, ref, className) => (
                <ButtonOutline width="100%" color="neutral" iconBefore="Public" marginBottom="10" aria-haspopup="true" onClick={onClick} ref={ref} className={className}>Additional Resources</ButtonOutline>)}
        </Popover>  
    )
  }
}