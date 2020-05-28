import React,  { useContext } from "react"
import { paddingTop } from 'styled-system';
import { Select, theme, Link, Icon, ActionList, ActionListItemColumn, ActionListItem, Menu, MenuDisclosure, MenuList, MenuItem, ButtonOutline, Space} from "@looker/components";
import styled, { ThemeProvider } from 'styled-components';
import {Banner, Box, Heading, Paragraph} from '@looker/components';
import {
    ExtensionContext,
    ExtensionContextData,
    getCore31SDK,
    getCore40SDK
  } from "@looker/extension-sdk-react"

export default function Experience(props) {
    const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
    const sdk = extensionContext.core31SDK
    // the sections of the board (aka use cases)
    var [sections, setSections] = React.useState([])
    // the board itself (aka vertical)
    var [title, setTitle] = React.useState('')
    var [emoji, setEmoji] = React.useState('')
    var [look_results, setLook] = React.useState(
        {'initial_value':{}}
    )
    var [description, setDescription] = React.useState('')
    var embedCtrRef = null;
    var section_objects = [];
    var new_look: {[k: string]: any} = {};
    const regex = '/(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g';

    const board = (board_id: any) => {
        console.log('Calling board')
        sdk.homepage(board_id).then(
            function(result){
                if (result.ok) {
                    var new_sections = []
                    // need to add in sorting by the secionts
                    for(var i = 0; i < result.value.homepage_sections.length; i++){
                        new_sections.push({
                            board_title: result.value.title,
                            description: result.value.homepage_sections[i].description,
                            id: i+1, 
                            title: result.value.homepage_sections[i].title
                        })
                    }
                    setSections(new_sections);
                    for (var i = 0; i < new_sections.length; i++) {
                        var uuid: string;
                        uuid = title.concat('_',sections[i].id);
                        var metadata = new_look[uuid];
                        section_objects.push(<Section 
                                                    key={i}
                                                    title={sections[i].title}
                                                    description={sections[i].description}
                                                    board_link={sections[i].trial_board}
                                                    //section_id={sections[i].section_id}
                                                    // customer_story={metadata.customer_story}
                                                    // day_in_the_life={metadata.day_in_the_life}
                                                    // explore_packet={metadata.explore_packet}
                                                    // explore_start={metadata.explore_start}
                                                    // recorded_demo={metadata.recorded_demo}
                                                    dashboard_start={'https://trial.looker.com/dashboards/'.concat(metadata.dashboard_start)}
                                            />);
                    }};
                    setTitle(result.value.title.replace(regex, ''));
                    setEmoji(result.value.title.match(regex));
                    setDescription(result.value.description);
                    return
                } 
                else {
                    console.error("Something went wrong:", result.error)
                }
            }
        )
    };

    // const look(look_id: any) {
    //     console.log('Calling look')
    //     // console.log(look_id)
    //     sdk.run_look({'look_id':look_id, 'result_format':'json'}).then(
    //         function(look_result){
    //             if (look_result.ok) {
    //                 // console.log('this is the run look result')
    //                 // console.log(look_result)
    //                 for(var i = 0; i < look_result.value.length; i++){ 
    //                     var uuid: string;
    //                     uuid = look_result.value[i]['demo_use_cases.vertical'].concat( '_', look_result.value[i]['demo_use_cases.section_id']);
    //                     //new_look = new_look[uuid];
    //                     new_look[uuid] = {
    //                         customer_story: look_result.value[i]['demo_use_cases.customer_story'],
    //                         day_in_the_life: look_result.value[i]['demo_use_cases.day_in_the_life'], 
    //                         explore_packet: look_result.value[i]['demo_use_cases.explore_packet'], 
    //                         explore_start: look_result.value[i]['demo_use_cases.explore_start'], 
    //                         dashboard_start: look_result.value[i]['demo_use_cases.dashboard_start_slug'], 
    //                         recorded_demo: look_result.value[i]['demo_use_cases.recorded_demo'], 
    //                         section_id: look_result.value[i]['demo_use_cases.section_id'], 
    //                         trial_board: look_result.value[i]['demo_use_cases.trial_board'],
    //                         vertical: look_result.value[i]['demo_use_cases.vertical']
    //                     }
    //                 }
    //                 return
    //             } 
    //             else {
    //                 console.error("Something went wrong:", look_result.error)
    //             }
    //         }
    //     )
    // };

    const runFunctions = (look_id: any, board_id: any) => {
        console.log('running function')
        // look(look_id)
        board(board_id)
    };

    const createSections = () => {
        console.log(sections)
        for (var i = 0; i < sections.length; i++) {
            var uuid: string;
            uuid = title.concat('_',sections[i].id);
            var metadata = new_look[uuid];
            section_objects.push(<Section 
                                        key={i}
                                        title={sections[i].title}
                                        description={sections[i].description}
                                        board_link={sections[i].trial_board}
                                        //section_id={sections[i].section_id}
                                        // customer_story={metadata.customer_story}
                                        // day_in_the_life={metadata.day_in_the_life}
                                        // explore_packet={metadata.explore_packet}
                                        // explore_start={metadata.explore_start}
                                        // recorded_demo={metadata.recorded_demo}
                                        dashboard_start={'https://trial.looker.com/dashboards/'.concat(metadata.dashboard_start)}
                                />);
        }};
    
    const lookId = 77;

    React.useEffect(() => {
        if (props.board_id) {
            runFunctions(lookId, props.board_id)        }
    }, [props.board_id]);

    // React.useEffect(() => {
    //     console.log('inside')
    //     for (var i = 0; i < sections.length; i++) {
    //         var uuid: string;
    //         uuid = title.concat('_',sections[i].id);
    //         var metadata = new_look[uuid];
    //         section_objects.push(<Section 
    //                                     key={i}
    //                                     title={sections[i].title}
    //                                     description={sections[i].description}
    //                                     board_link={sections[i].trial_board}
    //                                     //section_id={sections[i].section_id}
    //                                     customer_story={metadata.customer_story}
    //                                     day_in_the_life={metadata.day_in_the_life}
    //                                     explore_packet={metadata.explore_packet}
    //                                     explore_start={metadata.explore_start}
    //                                     recorded_demo={metadata.recorded_demo}
    //                                     dashboard_start={'https://trial.looker.com/dashboards/'.concat(metadata.dashboard_start)}
    //                             />);
    //     }}, [sections] );
    
    
    // console.log('showing look results')
    // console.log(look_results);
    
    return (
      <Box
        m='medium'
        border="1px solid black"
        borderRadius="4px"
        width='40%'
        marginLeft='50'
        padding='20'
      >
      <Paragraph fontSize = 'xxxlarge'  marginBottom='10' textAlign='center'>{emoji}</Paragraph>
      <Heading  fontSize='xlarge' fontWeight='Bold' textAlign='center'>{title}</Heading> 
      <div>{section_objects}</div>
      </Box>
    )
}

export function Section(props) {
      return (    
        <Box padding={10}>
        <Heading fontSize='small'>
            {(props.section_id+1).toString().concat('. ',props.title)}
        </Heading>
        <Paragraph fontSize='xsmall' fontStyle='italic' marginTop='5' marginBottom='10'>{props.description}</Paragraph> 
        <Box marginBottom={20}>
        <Space>
        <Menu>
         <MenuDisclosure>
           <ButtonOutline color="neutral"  size="small" iconBefore="Visualization">Go to Dashboards</ButtonOutline>
         </MenuDisclosure>
         <MenuList>
           <MenuItem >Dashboards</MenuItem>
           <MenuItem itemRole="link" target="_blank" href="https://google.com">Step by Step</MenuItem>
         </MenuList>
       </Menu>
       <Menu>
         <MenuDisclosure>
           <ButtonOutline color="neutral" size="small" iconBefore="Explore">Start Exploring</ButtonOutline>
         </MenuDisclosure>
         <MenuList>
           <MenuItem >Explore</MenuItem> 
           <MenuItem itemRole="link" target="_blank" href="https://google.com">Q & A Packet</MenuItem>
         </MenuList>
       </Menu>
       <Menu>
         <MenuDisclosure>
           <ButtonOutline color="neutral"  size="small" iconBefore="Public">Additional Resources</ButtonOutline>
         </MenuDisclosure>
         <MenuList>
           <MenuItem >Customer Stories</MenuItem>
           <MenuItem itemRole="link" target="_blank" href="https://google.com">Recorded Demo</MenuItem>
         </MenuList>
       </Menu>
        </Space>
        </Box>
       </Box>
      )
    }

