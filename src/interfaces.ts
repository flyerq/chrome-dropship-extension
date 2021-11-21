export interface Product {
  title: string;
  price: {
    amount: string | number;
    amountWithSymbol: string;
  };
  images: {
    origin: string;
    relatedColor: string;
    thumbnail: string;
  }[];
  colors: {
    goodsId: string;
    image: string;
    name: string;
    price: Product['price'];
  }[];
  sizes: {
    name: string;
    price: Product['price'];
  }[];
}

export interface Message<DataType> {
  type: string;
  data?: DataType | null;
}

export interface MessageResponse<DataType> {
  ok: boolean;
  data?: DataType | null;
  error?: any;
}