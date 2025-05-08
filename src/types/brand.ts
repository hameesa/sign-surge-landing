
export interface Brand {
  id: string;
  name: string;
  description: string;
  logo: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    [key: string]: string;
  };
  fonts: {
    heading: string;
    body: string;
    [key: string]: string;
  };
  createdAt: string;
}
