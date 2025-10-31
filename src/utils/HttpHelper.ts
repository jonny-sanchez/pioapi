export const timeout = function(s:number)
{
    return new Promise(function(_, reject) {
        setTimeout(() => {
            reject(new Error(`Lo sentimos la consulta tardo ${s} segundos!, intente de nuevo.`));
        }, s * 1000);
    });
};

export async function AJAX(
    url: string = '',
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS' = 'GET',
    api_token:string | null = '',
    uploadData:any = null,
    formData = false,
    blob:boolean = false,
    headers:any = null,
    timeoutFetch:number = 30 
) {

    try {

        const fetchResponse = fetch(`${ url }`, {
            method,
            headers: {
                'Accept': 'application/json',
                ...(blob === false && !formData && {
                    'Content-Type': 'application/json; charset=utf-8'
                }),
                ...(api_token ? { 'Authorization': `Bearer ${api_token}` } : {}),
                ...headers
            },
            ...(uploadData ? { body: formData ? uploadData : JSON.stringify(uploadData) } : {})
        })

        const response:Response = await Promise.race([fetchResponse, timeout(timeoutFetch)]) as Response
        const data:object | any = blob ? await response.blob() : await response.json()

        if(!response.ok) throw new Error(data?.message || 'Internal Server error response.')

        return data
        
    } catch (error:any) { 

        throw error
    }

}