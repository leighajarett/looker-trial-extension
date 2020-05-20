import React,  { useContext } from "react"
import { paddingTop } from 'styled-system';
import { Select, theme, Link, Icon, ActionList, ActionListItemColumn, ActionListItem } from "@looker/components";
import styled, { ThemeProvider } from 'styled-components';
import {Banner, Box, Heading, Paragraph} from '@looker/components';
import {
    ExtensionContext,
    ExtensionContextData,
    getCore31SDK
  } from "@looker/extension-sdk-react"


export const  ActionListItemStyle = styled(ActionListItem)`
    && {
        border-bottom: none;
        margin: 0px;
        padding: 0px;
        width: 50%;
        margin-top: 5px;
    }
`;

export const  ActionListItemColumnStyle = styled(ActionListItemColumn)`
    && {
        margin: 0px;
        padding: .5px;
    }
`;

export default function Experience(props) {
    const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
    const sdk = extensionContext.core31SDK
    // the sections of the board (aka use cases)
    var [sections, setSections] = React.useState([])
    // the board itself (aka vertical)
    var [title, setTitle] = React.useState('')
    var [emoji, setEmoji] = React.useState('')
    var [description, setDescription] = React.useState('')
    var embedCtrRef = null;
    const regex = '/(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g';

    const board = (board_id: any) => {
        console.log('api call happening')
        sdk.homepage(board_id).then(
            function(result){
                console.log(result)
                if (result.ok) {
                    var new_sections = []
                    // need to add in sorting by the secionts
                    console.log(result.value.id)
                    for(var i = 0; i < result.value.homepage_sections.length; i++){
                        new_sections.push({
                            description: result.value.homepage_sections[i].description,
                            id: i+1, 
                            title: result.value.homepage_sections[i].title,
                            board_link: '/boards/'.concat(result.value.id.toString())
                        })
                    }
                    console.log(new_sections);
                    setSections(new_sections);
                    setTitle(result.value.title.replace(regex, ''));
                    setEmoji(result.value.title.match(regex));
                    setDescription(result.value.description);
                } 
                else {
                    console.error("Something went wrong:", result.error)
                }
            }
        )
    }

    console.log(sections);
    var section_objects = [];
    for (var i = 0; i < sections.length; i++) {
        //grab the links to the other materials we want
        //ditl
        //recording
        //explore packet
        //explore starting place
        section_objects.push(<Section 
                                    key={i}
                                    title={sections[i].title}
                                    description={sections[i].description}
                                    board_link={sections[i].board_link}
                                    section_id={i}
                                    //do we want dashboard link here?
                                    // explore_start={sections[i].description}
                                    // explore_packet={sections[i].description}
                                    // recording={sections[i].description}
                                    // ditl={sections[i].description}
                            />);
    }

    React.useEffect(() => {
        if (props.board_id) {
            board(props.board_id);
        }
        }, [props.board_id]);

    return (
      <Box
        m='large'
        border="1px solid black"
        borderRadius="4px"
        width='30%'
        marginLeft='50'
        padding='20'
      >
      <Paragraph fontSize = 'xxxlarge'  marginBottom='10' textAlign='center'>{emoji}</Paragraph>
      <Heading  fontSize='large' fontWeight='semiBold' textAlign='center'>{title}</Heading> 
      <Paragraph fontSize = 'small'  textAlign='center' fontStyle='italic'>{description}</Paragraph>
      <div>{section_objects}</div>
      </Box>
    )
}

export function Section(props) {

      const dashboard_icon = (
        <Icon name="Visualization" color="palette.purple300" size={24} marginRight="small" />
      )
      const explore_icon = (
        <Icon name="Explore" color="palette.purple300" size={24} marginRight="small" />
      )
      const ditl_icon = (
        <Icon name="ExploreOutline" color="palette.purple300" size={24} marginRight="small" />
      )
      const ex_packet_icon = (
        <Icon name="FormatListNumbered" color="palette.purple300" size={24} marginRight="small" />
      )

      const customer_stories_icon = (
        <Icon name="Account" color="palette.purple300" size={24} marginRight="small" />
      )
      const see_recording_icon = (
        <Icon name="Public" color="palette.purple300" size={20} marginRight="small" />
      )



    //   const explore_link = (
    //     <Link
    //       onClick={(event) => event.stopPropagation()}
    //       href={props.board_link}
    //     >
    //         Explore the Data
    //     </Link>
    //   )

    
    
      const columns = [
        {
          id: (props.section_id+1),
          title: (props.section_id+1).toString().concat('. ',props.title),
          type: 'string',
          widthPercent: 100
        },
      ]

      return (
        <ActionList columns={columns}>
          <Paragraph fontSize='xsmall' fontStyle='italic' marginTop='5' marginBottom='10'>{props.description}</Paragraph>  
            <Box display='flex' marginLeft='30' flexWrap='wrap'>
                <ActionListItemStyle id={'dashboard'} onClick={() => alert(`Row clicked`)}>
                    <ActionListItemColumnStyle detail={'Go to Dashboards'} indicator={dashboard_icon}></ActionListItemColumnStyle>
                </ActionListItemStyle>
                <ActionListItemStyle id={'explore'} onClick={() => alert(`Row clicked`)} border-bottom={null} >
                    <ActionListItemColumnStyle detail={'Explore the Data'} indicator={explore_icon}></ActionListItemColumnStyle>
                </ActionListItemStyle>
                <ActionListItemStyle id={'ditl'} onClick={() => alert(`Row clicked`)} border-bottom={null} >
                    <ActionListItemColumnStyle detail={'Day in the Life'} indicator={ditl_icon}></ActionListItemColumnStyle>
                </ActionListItemStyle>
                <ActionListItemStyle id={'ex_packet'} onClick={() => alert(`Row clicked`)} border-bottom={null} >
                    <ActionListItemColumnStyle detail={'Q & A Packet'} indicator={ex_packet_icon}></ActionListItemColumnStyle>
                </ActionListItemStyle>
                <ActionListItemStyle id={'see_recording'} onClick={() => alert(`Row clicked`)} border-bottom={null} >
                    <ActionListItemColumnStyle detail={'Watch Demonstration'} indicator={see_recording_icon}></ActionListItemColumnStyle>
                </ActionListItemStyle>
                <ActionListItemStyle id={'customer_stories'} onClick={() => alert(`Row clicked`)} border-bottom={null} >
                    <ActionListItemColumnStyle detail={'Find Customer Stories'} indicator={customer_stories_icon}></ActionListItemColumnStyle>
                </ActionListItemStyle>
            </Box>
        </ActionList>
      )
    }

