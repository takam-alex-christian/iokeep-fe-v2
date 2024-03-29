"use client"


import { useContext, useEffect, useRef } from "react"

import { liveDataContext } from "@/contexts/liveDataContext"

//nextui imports
import { Button, ButtonProps, Divider } from "@nextui-org/react"

//font awesome lib imports
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { faBold, faItalic, faHeading, faUnderline, faRotateBackward, faRotateForward } from "@fortawesome/free-solid-svg-icons"

import { faFloppyDisk } from "@fortawesome/free-regular-svg-icons"


//lexical imports
import { FORMAT_TEXT_COMMAND, CAN_UNDO_COMMAND, UNDO_COMMAND, REDO_COMMAND, CAN_REDO_COMMAND, $getSelection, $isRangeSelection } from "lexical"

import { $setBlocksType } from "@lexical/selection"


import { HeadingNode, $createHeadingNode } from "@lexical/rich-text"

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

import { LexicalComposer } from "@lexical/react/LexicalComposer"

import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary"

//test data
import testNoteData from "@/data/test/notes.json"



const theme = {
    heading: {
        h1: "text-lg font-semibold my-2"
    },
    paragraph: "my-2",
    text: {
        bold: 'font-bold',
        // code: '',
        italic: 'italic',
        // strikethrough: '',
        // subscript: '',
        // superscript: '',
        underline: 'underline'
        // underlineStrikethrough: '',
    }
}

function onError(error: Error) {
    console.error(error)
}

function ToolButton(props: ButtonProps) {
    return (
        <Button
            className=""
            isIconOnly={true}
            variant="light"
            color={props.color ? props.color : "default"}
            {...props}
        />
    )
}

function CustomToolBar() {
    const [editor] = useLexicalComposerContext()

    function boldButtonHandler() {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")
    }

    function italicButtonHandler() {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")
    }

    function underlineButtonHandler() {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")
    }

    function headingButtonHandler() {


        editor.update(() => {
            const editorSelection = $getSelection();

            if ($isRangeSelection(editorSelection)) {
                $setBlocksType(editorSelection, () => $createHeadingNode("h1"));
            }
        })

    }

    // useEffect(()=>{

    //     editor.registerCommand(CAN_UNDO_COMMAND, (payload)=>{
    //         console.log(`content of the can_undo_command payload ${payload}`)
    //         return false
    //     }, 1)
    // }, [editor])

    function undoButtonHandler() {
        //@ts-ignore
        editor.dispatchCommand(UNDO_COMMAND);
    }

    function redoButtonHandler() {
        //@ts-ignore
        editor.dispatchCommand(REDO_COMMAND);
    }

    function saveButtonHandler() {
        // console.log(editor.getEditorState())
        const someJson = editor.getEditorState().toJSON() //this version of the editor state can be stringified and stored

        // someJson.root.children.forEach((eachChildren)=>{ // how you can go through each children node
        //     // console.log(eachChildren.type == "heading")
        // })

        console.log(someJson)

    }

    return (
        <div className="flex flex-row gap-2 justify-between p-2 bg-default/10 rounded-t-xl">
            <div className="flex flex-row flex-grow gap-6">
                <div className="flex flex-row gap-0 bg-default/20 rounded-xl">
                    <ToolButton onPress={undoButtonHandler}><FontAwesomeIcon icon={faRotateBackward} /></ToolButton>
                    <ToolButton onPress={redoButtonHandler}><FontAwesomeIcon icon={faRotateForward} /></ToolButton>
                </div>

                <div className="flex flex-row gap-2 flex-grow ">
                    <div>
                        <ToolButton onPress={headingButtonHandler}><FontAwesomeIcon icon={faHeading} /></ToolButton>
                    </div>
                    {/* <Divider orientation="vertical" /> */}
                    <div className="flex flex-row gap-0">
                        <ToolButton onPress={italicButtonHandler}><FontAwesomeIcon icon={faItalic} /></ToolButton>
                        <ToolButton onPress={boldButtonHandler}><FontAwesomeIcon icon={faBold} /></ToolButton>
                        <ToolButton onPress={underlineButtonHandler}><FontAwesomeIcon icon={faUnderline} /></ToolButton>
                    </div>
                </div>
            </div>
            <div>
                <ToolButton onPress={saveButtonHandler} ><FontAwesomeIcon className="text-lg" icon={faFloppyDisk} /></ToolButton>
            </div>

        </div>
    )
}

//test note fetcher 
async function loadTestNoteEditor(queryNoteId: string) {
    
    const foundNote = testNoteData.find(({ noteId }) => {
        return queryNoteId == noteId
    })

    if (foundNote) return foundNote.editorState
    else return {}
}

function AutoLoadSelectedNoteIntoEditor() {

    const { liveAppData } = useContext(liveDataContext)

    const [editorState] = useLexicalComposerContext()

    useEffect(() => {
        //save previous editorstate to deb

        //fetch new note Editor
        //load
        if (liveAppData.selectedNoteId) {
            loadTestNoteEditor(liveAppData.selectedNoteId!).then((fetchedEditorState) => {
                if (Object.keys(fetchedEditorState).length > 0) {

                    //should only be able to load if the fetched state is a valid editorstate
                    try {
                        //@ts-ignore
                        editorState.setEditorState(editorState.parseEditorState(fetchedEditorState))
                    } catch (e) {
                        console.log(e)
                    }


                }
            }, (e) => {
                console.log(`failed for reason - ${e}`)
            })
        }


    }, [liveAppData.selectedNoteId])


    //     const editorState = editor.parseEditorState(editorStateJSONString);
    //     editor.setEditorState(editorState);
    return null

}

function TextEditor() {

    const { liveAppData, liveAppDataDispatch } = useContext(liveDataContext)


    //ajust editor value to the selected note

    const initialConfig = {
        namespace: "TextEditor",
        theme,
        onError,
        nodes: [HeadingNode,]
    }




    return (
        <div className="flex flex-col flex-grow ">

            {/* lexical editor */}
            <LexicalComposer initialConfig={initialConfig}>
                <div className=" flex-grow flex flex-col gap-0 bg-white shadow-sm rounded-xl">
                    <CustomToolBar />
                    {/* <Divider orientation="horizontal" /> */}
                    {/* <Divider orientation="horizontal" /> */}
                    <div className=" relative flex flex-col flex-grow py-2 px-6 bg-">
                        <RichTextPlugin
                            contentEditable={<ContentEditable className=" focus-within:outline-none flex-grow py-4" />}
                            placeholder={<div className="absolute top-8 left-6 z-10 text-neutral-400">Don't stop writing...</div>}
                            ErrorBoundary={LexicalErrorBoundary}
                        />
                    </div>

                    <HistoryPlugin />
                    <AutoLoadSelectedNoteIntoEditor />
                </div>

            </LexicalComposer>
        </div>
    )
}


export default function NoteEditor() {
    return (
        <TextEditor />
    )
}