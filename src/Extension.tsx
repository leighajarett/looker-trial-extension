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
import {Icon, Box, Heading, Paragraph, Popover, PopoverContent, Text, Grid, ButtonOutline, Space, Menu, MenuList, MenuItem, Card, CardContent, ButtonTransparent} from '@looker/components'
import {
  ExtensionContext,
  ExtensionContextData,
  getCore31SDK,
  getCore40SDK
} from "@looker/extension-sdk-react"
import { useWizard } from './DDUWizard'
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
  const { extensionSDK } = extensionContext
  var [boardIds, setBoards] = React.useState([] as any)
  var inital_meta: { [key: string]: any } = {};
  var [metadata, setMetaData] = React.useState(inital_meta)
  var [isDeveloper, setDeveloper] = React.useState(false as boolean)
  var [instance, setInstance] = React.useState('')
  const wizard = useWizard()
  

  const updateBoards = (look_id: number, dimension_name: string) => {
    // update the state with the list of boards from our demo board list
    sdk.run_look({'look_id':look_id, 'result_format':'json', 'cache':true}).then(
      (result: any) => {
        var new_board_ids = [];
        if (result.ok) {
          for(var i = 0; i < result.value.length; i++){ 
              var b_id = parseInt(result.value[i][dimension_name]);
              new_board_ids.push(b_id);
          }
          setBoards(new_board_ids);
        } 
      }
    )
  };

  const updateMetaData = (look_id: number, dimension_name: string) => {
    // update the state with the list of boards from our demo board list
    sdk.run_look({'look_id':look_id, 'result_format':'json', 'cache':true}).then(
      (result: any) => {
        if (result.ok) {
          var new_board: {[b_id: string]: any} = {};
          for(var i = 0; i < result.value.length; i++){ 
            // index by the board & section id
            var b_id: string;
            var s_id: string;

            b_id = result.value[i][dimension_name];
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
              trial_board: result.value[i][dimension_name],
              vertical: result.value[i]['demo_use_cases.vertical']
          };
          }
          setMetaData(new_board);
          console.log("metadata: ")
          console.log(new_board)
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

  const getInstance = () => {
    sdk.versions().then(
      function(result: any){
        if (result.ok) {
          console.log(result)
          if (result.value.api_server_url == 'https://trial.looker.com:19999'){
            setInstance('trial')
          }
          else{
            setInstance('partnerdemo')
          }
        }
      }
    )
  }

  useEffect(() => {
    getInstance()
  },[])

  useEffect(() => {
      if(instance=='trial'){
        console.log('trial')
        updateBoards(79,'demo_use_cases.trial_board_id');
        updateMetaData(77,'demo_use_cases.trial_board_id');
        getModels();
      }
      else if(instance=='partnerdemo'){
        console.log('trial')
        updateBoards(13,'demo_use_cases.partnerdemo_board_id');
        updateMetaData(12,'demo_use_cases.partnerdemo_board_id');
        getModels();
      }
  }, [instance]);

  return (
  <>
    <Box m='large'>
      <Box display="flex" justifyContent="center">
        <Box maxWidth="700" textAlign="center">
          <Heading fontWeight='semiBold' marginBottom='10'>Welcome to your Looker Trial!</Heading>
          <Paragraph fontSize='medium'> We've created this instance so you can better understand how Looker will help you use data to drive real business value. 
            Here, you will be able to walk through a series of guided data experiences that we've developed based on common use cases we see from our customers. 
          </Paragraph>
        </Box>      
      </Box>
      <Box display="flex" justifyContent="center" marginTop="30">
        <Grid maxWidth="800" columns={isDeveloper ? 2 : 3}>
          <FeatureCard
            iconName="Visualization"
            title="Go to Dashboards"
            description="Start your Looker journey by a opening up a Dashboard, or going to the Board - which has all the Dashboards for the industry pinned for easy access"
          />
          <FeatureCard
            iconName="Explore"
            title="Start Exploring"
            description="Ready to learn how to ask new question of the data? Jump into an Explore and follow along with the Q & A Packet to get familiar with exploring data in Looker."
          />
          <FeatureCard
            iconName="Beaker"
            title="Guided Walkthroughs"
            description={
              <Box display="flex" flexDirection="column">
                <Text marginBottom="10" fontSize="small">You can use our interactive walkthroughs to learn how to use Looker. Download our partner's browser extension, and you're ready to go!</Text>
                <ButtonTransparent onClick={() => wizard.open()}>Setup</ButtonTransparent>
              </Box>
            }
          />
          {isDeveloper &&
          <FeatureCard
            iconName="Code"
            title="Begin Developing"
            description={
              <Box display="flex" flexDirection="column">
                <Text marginBottom="10" fontSize="small">Developing content in Looker starts with modeling your data in LookML. Use the ressources below to start learning.</Text>
                <Box display="flex" justifyContent="center" flexDirection="row">
                  <ButtonTransparent onClick={() =>  extensionSDK.openBrowserWindow('/projects/getting_started_with_lookml/','_blank')}>Learn LookML</ButtonTransparent>
                  <ButtonTransparent onClick={() =>  extensionSDK.openBrowserWindow('/projects/lookml_from_scratch','_blank')}>Practice LookML</ButtonTransparent>
                </Box>
              </Box>
            }
          />
          }
        </Grid>        
      </Box>
      <Box m='large' display='flex' flexWrap='wrap'>
        {
          boardIds.map((item: any, i: number) => 
            (<Experience key={i} board_id={item} board_metadata={metadata}/>)
          )
        }
      </Box>
      </Box>
  </>
)
}

export function FeatureCard(props:any) {
  return(
    <Card>
      <CardContent>
        <Heading
          as="h4"
          fontSize="xsmall"
          textTransform="uppercase"
          fontWeight="semiBold"
          color="grey"
          marginBottom="10"
        >
          <Box display="flex" >
            {/*<Icon marginRight="10" size="20" name={props.iconName}></Icon>*/}
            <Text fontSize="small" color="grey">{props.title}</Text>
          </Box>
          
        </Heading>
        <Text fontSize="small">
          {props.description}
        </Text>
      </CardContent>
    </Card>
  )
}
