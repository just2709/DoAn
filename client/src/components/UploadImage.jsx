import { FormControl, FormLabel, IconButton, Input } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { IoAddCircleOutline, IoImagesOutline } from "react-icons/io5";

export const ImageUpload = ({ selectedFile, setSelectedFile, preview, setPreview, setIsUploadFile }) => {
  const inputRef = useRef(null);

  const onSelectFile = (e) => {
    const listFiles = Array.from(e.target.files);

    if (!listFiles || listFiles.length === 0) {
      setSelectedFile(undefined);
      return;
    }

    const listImage = [];
    listFiles.map((file) => {
      if (file.type.includes("image")) {
        const objectUrl = URL.createObjectURL(file);
        listImage.push(objectUrl);
      }
      setIsUploadFile(true);
    });
    setSelectedFile(listFiles);
    setPreview(listImage);
  };

  return (
    <FormControl width={"auto"}>
      <Input ref={inputRef} type='file' onChange={onSelectFile} hidden multiple />
      <FormLabel margin={0}>
        <IconButton
          aria-label=''
          onClick={() => inputRef.current.click()}
          icon={<IoAddCircleOutline fontSize='1.5rem' color='#fff' />}
          backgroundColor='rgba(76, 175, 80, 0.4)'
          borderRadius='full'
          mx='0.2rem'
        />
      </FormLabel>
    </FormControl>
  );
};
