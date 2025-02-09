export const uploadToCloudinary = async (file: File): Promise<string> => {
    // Validate file before attempting upload
    if (!file || !(file instanceof File)) {
      throw new Error('Invalid file object');
    }
  
    const formData = new FormData();
    
    // Essential Cloudinary parameters
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
    ); 
    formData.append('cloud_name', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!
    );
    
    // Optional parameters for better organization and control
    formData.append('folder', 'Link-sharing-app');
    
    // Resource type should be determined automatically
  const endpoint = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`;
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Cloudinary Error Response:', errorText);
        throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
      }
  
      const data = await response.json();
      
      if (!data.secure_url) {
        throw new Error('Upload succeeded but no URL was returned');
      }
  
      return data.secure_url;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error(error instanceof Error ? error.message : 'Upload failed');
    }
  };
  
  