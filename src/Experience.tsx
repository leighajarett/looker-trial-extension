import React,  { useContext, useEffect } from "react"
import { Select, theme, Link, Icon, ActionList, ActionListItemColumn, ActionListItem, Menu, MenuDisclosure, MenuList, MenuItem, ButtonOutline, Space, ButtonItem} from "@looker/components";
import styled, { ThemeProvider } from 'styled-components';
import Modal from 'react-bootstrap/Modal';
import {Banner, Box, Heading, Paragraph, Button} from '@looker/components';
import {
    ExtensionContext,
    ExtensionContextData,
    getCore31SDK,
    getCore40SDK,
  } from "@looker/extension-sdk-react"

//import { sdkError } from "@looker/sdk";
// import './styles.css';

export default function Experience(props: any) {
  const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
  const sdk = extensionContext.core31SDK
  // the sections of the board (aka use cases)
  var [sections, setSections] = React.useState([] as any)
  // the board itself (aka vertical)
  var [title, setTitle] = React.useState('')
  var [emoji, setEmoji] = React.useState('')
  var [description, setDescription] = React.useState('')

  var embedCtrRef = null;
  var section_objects = [];
  // regex string for finding emojis
  const regex = '/(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g';

  const board = (board_metadata: { [key: string]: any }) => {
    sdk.homepage(props.board_id).then(
      function(result: any){
        console.log(result)
        if (result.ok) {
          var new_sections = []
          for(var i = 0; i < result.value.homepage_sections.length; i++){
            var id = result.value.section_order.indexOf(result.value.homepage_sections[i].id);
            //must have an explore link and a dashboard to start with or else it doesnt show up
            console.log("metadata in experience: ", id+1)
            if(board_metadata[id+1] && result.value.homepage_sections[i].homepage_items.length > 0 && (board_metadata[id+1].explore_start !== undefined && board_metadata[id+1].explore_start !== null)){
              //console.log(result.value.homepage_sections[i].title)
              new_sections.push({
                board_title: result.value.title,
                description: result.value.homepage_sections[i].description,
                id: id,
                title: result.value.homepage_sections[i].title,
                //match with metadata
                customer_story: board_metadata[id+1].customer_story,
                day_in_the_life: board_metadata[id+1].day_in_the_life,
                explore_packet: board_metadata[id+1].explore_packet,
                explore_start: '/explore/'.concat(board_metadata[id+1].explore_start),
                trial_board: '/browse/boards/'.concat(props.board_id),
                recorded_demo: board_metadata[id+1].recorded_demo,
                section_id: board_metadata[id+1].section_id,
                dashboard_start: '',
                dashboard_title: '',
                //vertical: board_metadata[i+1].vertical
              })
              if(result.value.homepage_sections[i].homepage_items.length > 0){
                new_sections[i]["dashboard_start"] = '/dashboards/'.concat(result.value.homepage_sections[i].homepage_items[0].dashboard_id)
                new_sections[i]["dashboard_title"] = result.value.homepage_sections[i].homepage_items[0].title
              }
            }
          }
          setSections(new_sections);
          setTitle(result.value.title.replace(regex, ''));
          setEmoji(result.value.title.match(regex));
          setDescription(result.value.description);
        } 
        else {
          if(result.error.message !== 'Not found'){
            console.error("Something went wrong:", result.error)
          }
        }
      }
    )
  };

  useEffect(() => {
    if (props.board_id) {
      if(props.board_metadata[props.board_id]){
        board(props.board_metadata[props.board_id])
      }
    }
  }, [props.board_id, props.board_metadata]);

  if(title !== undefined &&  title !== '' && sections.length > 0){
    sections.sort(function(a:any, b:any){
      return a.id - b.id;
    });

    return (
      <Box
      m='medium'
      border="1px solid black"
      borderRadius="4px"
      width='40%'
      // marginLeft='50'
      padding='20'
      marginLeft={'auto'}
      marginRight={'auto'}
      >
      <Paragraph fontSize = 'xxxlarge'  marginBottom='10' textAlign='center'>{emoji}</Paragraph>
      <Heading  fontSize='xlarge' fontWeight='bold' textAlign='center'>{title}</Heading> 
      <div>
          {
          //loop through to create the child section components
          sections.map((item: any, i: number) => (
              <Section 
              key={i}
              title={item.title}
              description={item.description}
              board_link={item.trial_board}
              section_id={item.section_id}
              customer_story={item.customer_story}
              day_in_the_life={item.day_in_the_life}
              explore_packet={item.explore_packet}
              explore_start={item.explore_start}
              recorded_demo={item.recorded_demo}
              dashboard_start={item.dashboard_start}
              dashboard_title={item.dashboard_title}
              vertical = {title}
          />))
          }
      </div>
      </Box>
  )
  }
  else{return null}
};

export function Section(props:any) {
      var dashboardList = []
      var dash_link_title = 'Start with the '.concat(props.dashboard_title,' Dashboard')
      var board_link_title = 'View all '.concat(props.vertical,' Dashboards')
      if(props.dashboard_start !== null && props.dashboard_start !== undefined){dashboardList.push({'name':dash_link_title, 'link': props.dashboard_start})};
      if(props.board_link !== null && props.board_link !== undefined){dashboardList.push({'name':board_link_title, 'link': props.board_link})};
      var experienceList = []
      if(props.explore_start !== null && props.explore_start !== undefined){experienceList.push({'name':'Start Exploring', 'link': props.explore_start})};
      // if(props.explore_packet !== null && props.explore_packet !== undefined){experienceList.push({'name':'Explore Q&A Packet', 'link': props.explore_packet})};
      var resourceList = []
      if(props.customer_story !== null && props.customer_story !== undefined){resourceList.push({'name':'Find Customer Stories', 'link': props.customer_story})};
      if(props.recorded_demo !== null && props.recorded_demo !== undefined){resourceList.push({'name':'Watch a Recorded Demo', 'link': props.recorded_demo})};

      return (    
        <Box padding={10}>
        <Heading fontSize='small'>
            {props.section_id.concat('. ',props.title)}
        </Heading>
        <Paragraph fontSize='xsmall' fontStyle='italic' marginTop='5' marginBottom='10'>{props.description}</Paragraph> 
        <Box marginBottom={20}>
        <Space>
        <ExperienceButton buttonTitle={'Go to Dashboards'} buttonIcon={"Visualization"} menuItems={dashboardList}></ExperienceButton>
        <ExperienceButton buttonTitle={'Start Exploring'} buttonIcon={"Explore"} menuItems={experienceList}></ExperienceButton>
        <ExperienceButton buttonTitle={'Walkthroughs'} buttonIcon={"Beaker"} menuItems={experienceList}></ExperienceButton>
        {/* {(props.recorded_demo || props.customer_story) ? <ExperienceButton buttonTitle={"Additional Resources"} buttonIcon={"Public"} menuItems={resourceList}></ExperienceButton>: <div></div>} */}
        </Space>
        </Box>
       </Box>
      )
    }


export function ExperienceButton(props:any){
  //props.menuItems.forEach((item:any) => console.log(item.name, item.link))
  // <iframe src="https://docs.google.com/document/d/e/2PACX-1vRQ45rPpvA4Oudid68SzISQ7tjTvMDg6HsaVcKQSCVPdmjcSNdXsgKF68FEdp8EpnuxLg7MgwemMX2t/pub?embedded=true"></iframe>

  return(
    <Menu>
      <MenuDisclosure>
        <ButtonOutline color="neutral"  size="small" iconBefore={props.buttonIcon}>{props.buttonTitle}</ButtonOutline>
      </MenuDisclosure>
      <MenuList>
        {
          props.menuItems.map((item: any, i: number) => 
            (
            <ExperienceMenuButton key={i} name={item.name} link={item.link}></ExperienceMenuButton>
            ))
            // <MenuItem key={item.name} itemRole="button" onClick={() => sdk.openBrowserWindow(item.link,'_blank')}>{item.name}</MenuItem>)
        }
      </MenuList>
    </Menu>
  )
}

export function ExperienceMenuButton(props:any){
  const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
  const sdk = extensionContext.extensionSDK
  var [show, setShow] = React.useState(false)

  console.log('Caling experience button')

  const handleClick = () => {
    console.log(props)
    if(props.name === 'Explore Q&A Packet' || props.name === 'Watch a Recorded Demo'){
      setShow(true)
      console.log('changed state')
    }
    else{
      sdk.openBrowserWindow(props.link,'_blank')
    }
  }
  
  return(<MenuItem key={props.key} itemRole="button" onClick={handleClick}>{props.name}</MenuItem>)
    {/* <Button onClick={handleClick}>{props.name}</Button> */}
      {/* <Modal
        show={show}
        onHide={() => setShow(false)}
        dialogClassName=".custom-modal-style"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Body>
          <iframe 
            style={{
              width: "100%",
              height: "100%"
            }}
            src={props.link}
          ></iframe>
        </Modal.Body>
      </Modal>*/}
}


