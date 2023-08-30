/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership. The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at
 * <p>
 * http://www.apache.org/licenses/LICENSE-2.0
 * <p>
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
package org.apache.fineract.api;


import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.apache.fineract.organisation.permission.Permission;
import org.apache.fineract.organisation.permission.PermissionRepository;
import org.apache.fineract.organisation.role.Role;
import org.apache.fineract.organisation.role.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;
import java.util.Collection;
import java.util.List;

import static java.util.stream.Collectors.toList;
import static org.apache.fineract.api.AssignmentAction.ASSIGN;

@RestController
@SecurityRequirement(name = "auth")
@RequestMapping("/api/v1")
public class RolesApi {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PermissionRepository permissionRepository;

    @GetMapping(path = "/roles", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<Role> retrieveAll() {
        return this.roleRepository.findAll();
    }

    @GetMapping(path = "/role/{roleId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public Role retrieveOne(@PathVariable("roleId") Long roleId, HttpServletResponse response) {
        Role role = roleRepository.findById(roleId).get();
        if(role != null) {
            return role;
        } else {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            return null;
        }
    }

    @GetMapping(path = "/role/{roleId}/permissions", produces = MediaType.APPLICATION_JSON_VALUE)
    public Collection<Permission> retrievePermissions(@PathVariable("roleId") Long roleId, HttpServletResponse response) {
        Role role = roleRepository.findById(roleId).get();
        if(role != null) {
            return role.getPermissions();
        } else {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            return null;
        }
    }

    @PostMapping(path = "/role", consumes = MediaType.APPLICATION_JSON_VALUE)
    public void create(@RequestBody Role role, HttpServletResponse response) {
        Role existing = roleRepository.getRoleByName(role.getName());
        if (existing == null) {
            role.setId(null);
            roleRepository.saveAndFlush(role);
        } else {
            response.setStatus(HttpServletResponse.SC_CONFLICT);
        }
    }

    @PutMapping(path = "/role/{roleId}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public void update(@PathVariable("roleId") Long roleId, @RequestBody Role role, HttpServletResponse response) {
        Role existing = roleRepository.findById(roleId).get();
        if (existing != null) {
            role.setId(roleId);
            role.setAppUsers(existing.getAppusers());
            role.setPermissions(existing.getPermissions());
            roleRepository.saveAndFlush(role);
        } else {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
        }
    }

    @DeleteMapping(path = "/role/{roleId}")
    public void delete(@PathVariable("roleId") Long roleId, HttpServletResponse response) {
        if(roleRepository.existsById(roleId)) {
            roleRepository.deleteById(roleId);
        } else {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
        }
    }

    @PutMapping(path = "/role/{roleId}/permissions", consumes = MediaType.APPLICATION_JSON_VALUE)
    public void permissionAssignment(@PathVariable("roleId") Long roleId, @RequestParam("action") AssignmentAction action,
                                     @RequestBody EntityAssignments assignments, HttpServletResponse response) {
        Role existingRole = roleRepository.findById(roleId).get();
        if (existingRole != null) {
            Collection<Permission> permissionToAssign = existingRole.getPermissions();
            List<Long> existingPermissionIds = permissionToAssign.stream()
                    .map(Permission::getId)
                    .collect(toList());
            List<Permission> deltaPermissions = assignments.getEntityIds().stream()
                    .filter(id -> {
                        if (ASSIGN.equals(action)) {
                            return !existingPermissionIds.contains(id);
                        } else { // revoke
                            return existingPermissionIds.contains(id);
                        }
                    })
                    .map(id -> {
                        Permission p = permissionRepository.findById(id).get();
                        if (p == null) {
                            throw new RuntimeException("Invalid permission id: " + id + " can not continue assignment!");
                        } else {
                            return p;
                        }
                    }).collect(toList());

            if (!deltaPermissions.isEmpty()) {
                if (ASSIGN.equals(action)) {
                    permissionToAssign.addAll(deltaPermissions);
                } else { // revoke
                    permissionToAssign.removeAll(deltaPermissions);
                }
                existingRole.setPermissions(permissionToAssign);
                roleRepository.saveAndFlush(existingRole);
            }
        } else {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
        }
    }
}
