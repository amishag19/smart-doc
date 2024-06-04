import { TextEditorBlock } from "react-web-editor"

function TextEditorComponent () {
    return (
        <TextEditorBlock
        width={300}
        height={100}
        top={500}
        left={800}
        unit={"rem"}
        parentStyle={{ width: 500, height: 300 }}
        />
    );
}
export default TextEditorComponent;