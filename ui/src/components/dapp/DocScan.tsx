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
import { Button } from '@chakra-ui/react';

const DocScan: FC<{ setAge: Dispatch<SetStateAction<number>> }> = ({
  setAge,
}) => {
  const [file, setFile] = useState<File>();
  const [previewUrl, setPreviewUrl] = useState<string | ArrayBuffer>('');
  const [dob, setDOB] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];

    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result || '');
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
    }
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
            >
              <label htmlFor="file-upload">Upload your document</label>
            </Button>
          </div>
          {previewUrl && (
            <div
              style={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                padding: 20,
              }}
            >
              <img
                src={previewUrl.toString()}
                alt="Document Preview"
                style={{ maxHeight: '700px' }}
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
          )}
          {previewUrl && (
            <div style={{ margin: 20 }}>
              <Button variant="solid" type="submit" bg="black" color="white">
                Scan Document
              </Button>
            </div>
          )}
        </form>
        {dob && (
          <div className="ocr-results">
            <p>Date of Birth: {dob}</p>
            {}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocScan;
