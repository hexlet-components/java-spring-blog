package io.hexlet.blog.mapper;

import org.mapstruct.InheritConfiguration;
import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import io.hexlet.blog.dto.PostDTO;
import io.hexlet.blog.model.Post;

@Mapper(
    uses = { JsonNullableMapper.class, ReferenceMapper.class },
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
    componentModel = MappingConstants.ComponentModel.SPRING
)
public abstract class PostMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "author", source = "authorId")
    public abstract Post map(PostDTO model);

    @Mapping(source = "author.id", target = "authorId")
    @InheritInverseConfiguration(name = "map")
    
    public abstract PostDTO map(Post model);

    @InheritConfiguration
    public abstract void update(PostDTO update, @MappingTarget Post destination);
}
