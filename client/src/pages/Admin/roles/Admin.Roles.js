import React, {Fragment, useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {selectCurrentToken} from "../../../app/features/auth/authSlice";
import {useGetRolesQuery, useRemoveRoleMutation} from "../../../app/features/AdminApies/RolesApiSlice";
import {CloseButton} from "../../../components/FormsComponents";
import {AiFillDelete, AiFillEdit, AiOutlineClose} from "react-icons/ai";
import {Header, Table, Wrapper} from "../../../components/tableComponents";
import {BiDownArrow} from "react-icons/bi";
import {Link} from "react-router-dom";
import {FaUniversalAccess} from "react-icons/fa";
import LoadingComponent from "../../../components/LoadingComponent";
import {BsGearWide} from "react-icons/bs";
import {IoCreate} from "react-icons/io5";
import AdminRoleForm from "./Admin.RoleForm";
import Swal from "sweetalert2";


const AdminRoles = () => {
    const token = useSelector(selectCurrentToken);
    const {data, isLoading} = useGetRolesQuery({token});
    const [roles, setRoles] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formMode, setFormMode] = useState("create");
    const [selectedRole, setSelectedRole] = useState(null)
    const [remove] = useRemoveRoleMutation()
    useEffect(() => {
        if (!isLoading) {
            console.log(data)
            setRoles(data.roles)
        }
    }, [data])
    return (
        <Fragment>
            {showForm && (
                <Fragment>
                    <CloseButton onClick={() => {
                        setShowForm(false)
                        setSelectedRole(null)
                    }}>
                        <AiOutlineClose/>
                    </CloseButton>
                    <AdminRoleForm mode={formMode} id={selectedRole}/>
                </Fragment>
            )}
            <Wrapper>
                <Header>
                    <h3>Roles</h3>
                    <div>
                        <button>
                            Export <BiDownArrow/>
                        </button>
                        <button>
                            <Link to={"/admin/Permissions"}>Permissions <FaUniversalAccess/></Link>
                        </button>
                        <button
                            onClick={() => {
                                setShowForm(true)
                            }}
                        >
                            Create New <IoCreate/>
                        </button>


                    </div>
                </Header>
                <Table>
                    {isLoading ? (
                        <LoadingComponent/>
                    ) : roles?.length > 0 ? (
                        <Fragment>
                            <thead>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Permissions</th>
                            <th>
                                <BsGearWide/>
                            </th>
                            </thead>
                            {roles?.map((role) => (
                                <tr key={role._id}>
                                    <td>{role._id}</td>
                                    <td>{role.title}</td>
                                    <td>{role.permissions ? role.permissions.map(permission => (
                                        <span key={permission._id}>{permission.title}</span>)) : "❌"}</td>
                                    <td className="flex">
                                        <div className="btnContainer">
                                            <button className={"editBtn"} onClick={() => {
                                                setShowForm(true)
                                                setFormMode("edit")
                                                setSelectedRole(role._id)
                                            }}>
                                                Edit <AiFillEdit/>
                                            </button>
                                            <button
                                                className={"deleteBtn"}
                                                onClick={() => {
                                                    Swal.fire({
                                                        title: "Do you want to delete this Role?",
                                                        showDenyButton: true,
                                                        confirmButtonText: "Delete",
                                                    }).then(async (result) => {
                                                        if (result.isConfirmed) {
                                                            const response = await remove({
                                                                token: token,
                                                                id: role._id,
                                                            }).unwrap();
                                                            if (response.success) {
                                                                Swal.fire({
                                                                    icon: "success",
                                                                    title: "Deleted!",
                                                                });
                                                                setRoles((roles) => [
                                                                    ...roles.filter(
                                                                        (pr) => pr._id !== role._id
                                                                    ),
                                                                ]);
                                                            }
                                                            if (response.error) {
                                                                return Swal.fire({
                                                                    icon: "error",
                                                                    title: "Failed to delete.",
                                                                });
                                                            }
                                                        }
                                                    });
                                                }}
                                            >
                                                Delete <AiFillDelete/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </Fragment>
                    ) : (
                        <h1>No Role</h1>
                    )}
                </Table>
            </Wrapper>
        </Fragment>
    );
};

export default AdminRoles;