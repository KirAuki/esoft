import { useState } from "react";

export function useForm<T>(initialState: T | null, fetchData: () => void) {
    const [formVisible, setFormVisible] = useState<boolean>(false);
    const [currentItem, setCurrentItem] = useState<T | null>(initialState);

    const handleCreate = () => {
        setCurrentItem(null);
        setFormVisible(true);
    };

    const handleEdit = (item: T) => {
        setCurrentItem(item);
        setFormVisible(true);
    };

    const handleCloseForm = () => {
        setFormVisible(false);
    };

    const handleUpdate = () => {
        fetchData();
        setFormVisible(false);
    };

    return {
        formVisible,
        currentItem,
        setFormVisible,
        handleCreate,
        handleEdit,
        handleCloseForm,
        handleUpdate,
    };
}
