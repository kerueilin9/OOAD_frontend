declare type BackendResponse<T = any> = {
  data: {
    code: string;
    msg: string;
    url: T;
    response_time: string;
    result?: T;

    // Shopee adopted fields
    message?: string;
    response?: T;

    // error
    is_platform_error?: boolean;
    exception?: string;
    exception_detail?: string;
  };
};
