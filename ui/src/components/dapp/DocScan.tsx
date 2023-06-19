import React, {
  ChangeEvent,
  FormEvent,
  useState,
  FC,
  Dispatch,
  SetStateAction,
} from 'react';
import Tesseract from 'tesseract.js';
import DotLoader from 'react-spinners/DotLoader';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Box,
} from '@chakra-ui/react';

const DocScan: FC<{
  setAge: Dispatch<SetStateAction<number>>;
  onScan: () => void;
}> = ({ setAge, onScan }) => {
  const [file, setFile] = useState<File>();
  const [previewUrl, setPreviewUrl] = useState<string | ArrayBuffer>('');
  const [dob, setDOB] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];

    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result || '');
        setIsOpen(true);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl('');
    }
    setDOB('');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (file) {
      setLoading(true);
      const { data } = await Tesseract.recognize(file);
      const dobRegex =
        /(0?[1-9]|[12][0-9]|3[01])[\/\-\.](0?[1-9]|1[0-2])[\/\-\.](19|20)\d{2}/;
      const dobMatch = data.text.match(dobRegex);
      const dob = dobMatch ? dobMatch[0] : '';
      setDOB(dob);
      // turn off the loading spinner after OCR is done
      setLoading(false);

      var output = dob.replace(/(\d\d)\/(\d\d)\/(\d{4})/, '$3-$2-$1');

      let age = new Date().getTime() - new Date(output).getTime();

      setAge(Math.floor(age / (60 * 60 * 24 * 365 * 1000)));
      setIsOpen(false);
    }

    onScan();
  };

  return (
    <div className="container" style={{ textAlign: 'center' }}>
      <div>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="file"
              id="file-upload"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />

            <Button
              variant="solid"
              bg="black"
              _hover={{ bg: 'gray.600' }}
              color="white"
              as="label"
              htmlFor="file-upload"
              sx={{ marginTop: '20px' }}
            >
              Upload your document
            </Button>
          </div>
          {previewUrl && (
            <>
              <Modal
                isOpen={isOpen}
                onClose={() => {
                  setIsOpen(false);
                }}
              >
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader></ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <div
                      style={{
                        position: 'relative',
                        display: 'flex',
                        justifyContent: 'center',
                        padding: 10,
                      }}
                    >
                      <img
                        src={previewUrl.toString()}
                        alt="Document Preview"
                        style={{ maxHeight: '650px' }}
                      />
                      {loading && (
                        <div
                          style={{
                            position: 'absolute',
                            inset: '0',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <DotLoader />
                        </div>
                      )}
                    </div>
                  </ModalBody>

                  <ModalFooter>
                    <Button
                      colorScheme="gray"
                      mr={3}
                      onClick={() => {
                        setIsOpen(false);
                      }}
                    >
                      Close
                    </Button>
                    <Button
                      variant="solid"
                      bg="black"
                      _hover={{ bg: 'gray.600' }}
                      color="white"
                      onClick={() => {
                        document.getElementById('scan-btn')?.click();
                      }}
                      isLoading={loading}
                      loadingText="Scanning"
                    >
                      Scan Document
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </>
          )}
          {previewUrl && (
            <Box
              sx={{
                margin: 10,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                columnGap: 10,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  setIsOpen(true);
                }}
              >
                <div style={{ borderRadius: 10, overflow: 'hidden' }}>
                  <img
                    src={previewUrl.toString()}
                    alt="Document Preview"
                    style={{ maxHeight: '100px' }}
                  />
                </div>
                <div style={{ fontSize: 12 }}>Click to preview</div>
              </div>
              <Button
                variant="solid"
                bg="black"
                _hover={{ bg: 'gray.600' }}
                color="white"
                id="scan-btn"
                type="submit"
                isLoading={loading}
                loadingText="Scanning"
              >
                Scan Document
              </Button>
            </Box>
          )}
        </form>
        {dob && (
          <Box sx={{ margin: 10, fontWeight: 500, fontSize: 20 }}>
            Date of Birth: {dob}
          </Box>
        )}
      </div>
    </div>
  );
};

export default DocScan;
