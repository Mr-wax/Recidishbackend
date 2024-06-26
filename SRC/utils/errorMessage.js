export const formatZodError =(errors) => {
    return errors.map((error) => error.path.join('.').concat('; ',error.message))
}